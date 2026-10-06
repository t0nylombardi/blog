import {profile} from '@/domain/profile/personal.data'

const PersonalData = () => {
  const entries = Object.entries(profile)

  return (
    <pre className="whitespace-pre-wrap wrap-break-word text-left text-ctp-text text-xl">
      <code>
        <span className="text-ctp-mauve-500">const </span>
        {'consultant = {\n'}
        {entries.map(([key, value], index) => (
          <span key={key}>
            {`  ${key}: `}
            {Array.isArray(value) ? (
              <>
                {'[\n'}
                {value.map((item, itemIndex) => (
                  <span key={item}>
                    {'    '}
                    <span className="text-ctp-green-500">{JSON.stringify(item)}</span>
                    {itemIndex < value.length - 1 ? ',\n' : '\n'}
                  </span>
                ))}
                {'  ]'}
              </>
            ) : (
              <span className="text-ctp-green-500">{JSON.stringify(value)}</span>
            )}
            {index < entries.length - 1 ? ',\n' : '\n'}
          </span>
        ))}
        {'}'}
      </code>
    </pre>
  )
}

export default PersonalData
