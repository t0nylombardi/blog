---
title: 'Rails Service Objects Need a Job Description'
date: '09-06-2026'
heroImage: '/blog/rails-service-objects/rails-service-objects.jpg'
image: '/blog/rails-service-objects/rails-service-objects.jpg'
originalDatePublished:
description: 'Moving code into a service object doesn’t automatically make Rails code cleaner. Learn how clear responsibilities, explicit contracts, and meaningful tests turn an extraction into a better design.'
author: 'Anthony Lombardi'
categories: [engineering, archetecture, software-development]
tags: [ruby, rails]
draft: false
---

A Rails controller with six lines looks great in a pull request. Unfortunately, the other eighty lines may have simply moved into a class called `DocumentService`, where they now have fewer witnesses.

Extracting an object is easy. Deciding what it owns is the architectural work.

This is where Rails teams often lie to themselves with excellent posture. We see a controller getting chunky, we whisper "single responsibility principle" like it's a spell from a bootcamp-branded Hogwarts, and then we move the mess into `ShareDocumentService`.

The controller gets smaller. The code review gets calmer. The complexity remains in the building, wearing a fake mustache.

The real question is not "Can I move this code out of the controller?" You can. Rails will let you. Ruby will let you. Your editor will autocomplete the betrayal.

The better question is: "Does this new object have a real job?"

Let's use a simplified example inspired by real product domains: document sharing inside a multi-tenant Rails app. Think law firms, loan applications, real estate workflows, client portals, that whole beautiful swamp where permissions matter and one wrong `firm_id` check can turn your Monday into a compliance-themed escape room.

Imagine a controller action like this:

```ruby
class DocumentSharesController < ApplicationController
  def create
    document = Document.find(params[:document_id])
    recipient = User.find(params[:recipient_id])

    unless current_user.firm_id == document.firm_id
      return render json: { error: "Not authorized" }, status: :forbidden
    end

    unless recipient.firm_id == document.firm_id
      return render json: { error: "Recipient is outside the firm" }, status: :unprocessable_entity
    end

    share = DocumentShare.create!(
      document: document,
      sender: current_user,
      recipient: recipient,
      message: params[:message]
    )

    DocumentShareNotifierJob.perform_later(share.id)

    render json: { id: share.id }, status: :created
  end
end
```

This action checks firm membership, authorizes access, saves a record, and schedules a notification. It is not the worst controller in the world. Nobody needs to throw a chair. But it has several responsibilities living together in a studio apartment.

So we do the obvious Rails thing:

```ruby
class DocumentSharesController < ApplicationController
  def create
    share = ShareDocumentService.call(
      document_id: params[:document_id],
      recipient_id: params[:recipient_id],
      sender: current_user,
      message: params[:message]
    )

    render json: { id: share.id }, status: :created
  rescue ShareDocumentService::Error => e
    render json: { error: e.message }, status: e.status
  end
end
```

Clean. Tidy. Deceptively soothing. Like putting all your browser tabs into one window named "Research."

Then the service:

```ruby
class ShareDocumentService
  class Error < StandardError
    attr_reader :status

    def initialize(message, status:)
      @status = status
      super(message)
    end
  end

  def self.call(document_id:, recipient_id:, sender:, message:)
    document = Document.find(document_id)
    recipient = User.find(recipient_id)

    unless sender.firm_id == document.firm_id
      raise Error.new("Not authorized", status: :forbidden)
    end

    unless recipient.firm_id == document.firm_id
      raise Error.new("Recipient is outside the firm", status: :unprocessable_entity)
    end

    share = DocumentShare.create!(
      document: document,
      sender: sender,
      recipient: recipient,
      message: message
    )

    DocumentShareNotifierJob.perform_later(share.id)

    share
  end
end
```

The controller shrank. Great. But what actually improved?

Maybe not much.

The service still knows how to find records, enforce tenant boundaries, create shares, decide failure semantics, and schedule async work. It is basically the controller wearing a blazer.

That does not make the extraction useless. It means the extraction is unfinished. The new object needs a job description.

A better service object owns an operation. Not a folder. Not a vibe. An operation.

For this example, the operation is: "Share this document from this user to this recipient."

That gives us sharper questions:

- Who may share the document?
- Who may receive it?
- What happens when the operation fails?
- Who owns the transaction?
- When can the notification safely run?

Only someone from the document's firm should be able to share it, and possibly only someone with document-level permission. Firm membership is the outer wall. It is not always the whole building.

In this simplified version, only another user in the same firm can receive the document. In a real system, maybe external clients can receive documents through a different workflow. That matters because "share internally" and "send externally" may look similar in the UI while having very different risk profiles.

A failed operation should return a predictable result. It should not leak random ActiveRecord exceptions into the controller and make the controller interpret five different failure modes like it is reading tea leaves in production logs.

The operation should also own the transaction. If creating the share succeeds but something else inside the operation fails, we need to know whether the share should exist. Transaction ownership belongs where the business operation is defined.

The notification should run only after the share is safely committed. Not "after we called `create!` and hoped the database was feeling emotionally available." If the transaction rolls back, no notification should go out.

Now the service has a clearer contract:

```ruby
class ShareDocument
  Result = Data.define(:success?, :share, :error)

  def self.call(...)
    new(...).call
  end

  def initialize(document:, sender:, recipient:, message:)
    @document = document
    @sender = sender
    @recipient = recipient
    @message = message
  end

  def call
    return failure("Not authorized") unless sender_can_share?
    return failure("Recipient is outside the firm") unless recipient_can_receive?

    share = nil

    DocumentShare.transaction do
      share = DocumentShare.create!(
        document: document,
        sender: sender,
        recipient: recipient,
        message: message
      )
    end

    DocumentShareNotifierJob.perform_later(share.id)

    Result.new(success?: true, share: share, error: nil)
  end

  private

  attr_reader :document, :sender, :recipient, :message

  def sender_can_share?
    sender.firm_id == document.firm_id
  end

  def recipient_can_receive?
    recipient.firm_id == document.firm_id
  end

  def failure(message)
    Result.new(success?: false, share: nil, error: message)
  end
end
```

There is still room to improve this. For example, in a production Rails app, I would usually schedule the notification with an `after_commit` hook or another explicit after-commit mechanism. The important point is the contract: rejected shares do not create records, and they do not notify anyone.

Now the controller becomes boring in the best possible way:

```ruby
class DocumentSharesController < ApplicationController
  def create
    result = ShareDocument.call(
      document: Document.find(params[:document_id]),
      recipient: User.find(params[:recipient_id]),
      sender: current_user,
      message: params[:message]
    )

    if result.success?
      render json: { id: result.share.id }, status: :created
    else
      render json: { error: result.error }, status: :unprocessable_entity
    end
  end
end
```

The controller handles HTTP. The service handles the application operation. That separation is useful because each part now has a job you can explain without needing a corkboard and red string.

But this is also where developers sometimes sprint directly into enterprise cosplay.

Does this need a repository? Probably not.

If this Rails app uses ActiveRecord directly everywhere else, creating a `DocumentShareRepository` just to wrap `DocumentShare.create!` may add ceremony without reducing complexity. Repositories can help when persistence rules are complex, when you need to isolate a truly unstable data source, or when the domain should not know about the database. But in a conventional Rails app, ActiveRecord is already the persistence abstraction. You do not get bonus architecture points for wrapping it in a trench coat.

Does it need an interface?

Again, probably not yet. If there is one implementation and no meaningful alternative, an interface may be a prediction disguised as design. Interfaces are useful when they protect you from volatility: multiple notification providers, external APIs, payment gateways, storage backends. They are less useful when they exist because someone saw a diagram once and got inspired.

Does it need another service?

Maybe, but make it earn rent.

If authorization rules become shared across document actions, extract a policy object. If notification delivery becomes complex, extract a notifier. If tenant membership rules are central and subtle, give them a home. But do not split code just because the service reached line 40 and your linter started making eye contact.

The goal is not smaller files. The goal is better containment.

A meaningful test should prove the operation's promise, not just its implementation. For this example, the promise is simple: a user from another firm cannot share the document, and a rejected operation produces no notification.

```ruby
RSpec.describe ShareDocument do
  describe ".call" do
    it "rejects a sender from another firm and sends no notification" do
      document = create(:document, firm: create(:firm))
      sender = create(:user, firm: create(:firm))
      recipient = create(:user, firm: document.firm)

      expect {
        result = described_class.call(
          document: document,
          sender: sender,
          recipient: recipient,
          message: "Please review"
        )

        expect(result).not_to be_success
        expect(result.error).to eq("Not authorized")
      }.not_to have_enqueued_job(DocumentShareNotifierJob)

      expect(DocumentShare.count).to eq(0)
    end
  end
end
```

That test matters because it describes the operation's boundary. It says: this object is responsible for preventing cross-tenant sharing, and it must not trigger side effects when the operation is rejected.

That is the job description.

The service is no longer "the place we moved controller code." It is the owner of a business operation with rules, failure behavior, and side-effect boundaries.

That distinction is the difference between cleanliness and architecture.

Folder structure can help people find code. Naming conventions can help people guess intent. Service objects can absolutely make Rails applications easier to change. But none of those things force good design.

A `services/` directory does not save you. A `ShareDocumentService` class does not save you. Even the word "architecture" does not save you, though it does look expensive in a slide deck.

The work is deciding what belongs together.

In this case, authorization, share creation, transaction ownership, and notification timing belong together because they define one operation. If any of those rules change, you want the change contained in one place. If the controller changes from JSON to Turbo Streams, the operation should not care. If the notification system changes, the operation should still define when notification is allowed.

That is when extracting a service improves a Rails app.

Not when the controller gets smaller.

When the new object can look you in the eye and answer: "Here is what I own."
