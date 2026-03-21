import {BaseWrapper} from '@components/layout/BaseWrapper'

export default function NotFound() {
  return (
    <BaseWrapper>
      <div className="container mx-auto px-4 md:px-0 py-24 lg:py-40 flex justify-center items-center">
        <div className="text-2xl flex flex-col justify-center items-center">
          <h1 className="404-text text-9xl rotate-180">404</h1>
          <br />
          <h2 className="mt-14">You&apos;re Lost ...</h2>
        </div>
      </div>
    </BaseWrapper>
  )
}
