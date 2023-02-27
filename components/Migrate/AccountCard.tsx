import { Dispatch, ReactElement, SetStateAction } from 'react'

const ipAddressRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
const domainRegex = /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*\.[a-zA-Z]{2,}$/

const portOptions = [
  { label: '143', value: 143 },
  { label: '993', value: 993 }
]

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(' ')
}

interface SourceProps {
  sourceServer: string
  setSourceServer: Dispatch<SetStateAction<string>>
  sourceServerError: any
  setSourceServerError: Dispatch<SetStateAction<any>>
  sourcePort: number
  setSourcePort: Dispatch<SetStateAction<number>>
  sourceUsername: string
  setSourceUsername: Dispatch<SetStateAction<string>>
  sourcePassword: string
  setSourcePassword: Dispatch<SetStateAction<string>>
  sourceSecure: boolean
  setSourceSecure: Dispatch<SetStateAction<boolean>>
}

interface DestinationProps {
  destinationServer: string
  setDestinationServer: Dispatch<SetStateAction<string>>
  destinationServerError: any
  setDestinationServerError: Dispatch<SetStateAction<any>>
  destinationPort: number
  setDestinationPort: Dispatch<SetStateAction<number>>
  destinationUsername: string
  setDestinationUsername: Dispatch<SetStateAction<string>>
  destinationPassword: string
  setDestinationPassword: Dispatch<SetStateAction<string>>
  destinationSecure: boolean
  setDestinationSecure: Dispatch<SetStateAction<boolean>>
}

export function SourceAccountCard(props: SourceProps): ReactElement {
  function handleSourceServerChange(event: any) {
    const value = event.target.value
    if (ipAddressRegex.test(value) || domainRegex.test(value)) {
      props.setSourceServer(value)
      props.setSourceServerError(null)
    } else {
      props.setSourceServer(value)
      props.setSourceServerError(
        'Invalid input. Please enter a valid IP address or domain name.'
      )
    }
  }

  return (
    <div className="rounded-lg bg-gray-50 px-4 py-5 shadow sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Source Account
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Enter the IMAP details for the email account you&apos;d like to move
            messages from.
          </p>
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-4 sm:col-span-5">
              <label
                htmlFor="source-hostname"
                className="block text-sm font-medium text-gray-700"
              >
                Server Hostname
              </label>
              <input
                value={props.sourceServer}
                onChange={handleSourceServerChange}
                type="text"
                name="source-hostname"
                id="source-hostname"
                className={classNames(
                  props.sourceServerError
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                  'mt-1 block w-full rounded-md shadow-sm sm:text-sm'
                )}
              />
              {props.sourceServerError && (
                <p className="mt-2 text-sm text-red-500">
                  {props.sourceServerError}
                </p>
              )}
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="source-port"
                className="block text-sm font-medium text-gray-700"
              >
                Port
              </label>
              <select
                value={props.sourcePort}
                onChange={(event) =>
                  props.setSourcePort(Number(event.target.value))
                }
                id="source-port"
                name="source-port"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                {portOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="source-username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                value={props.sourceUsername}
                onChange={(event) =>
                  props.setSourceUsername(event.target.value)
                }
                type="text"
                name="source-username"
                id="source-username"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="source-password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                value={props.sourcePassword}
                onChange={(event) =>
                  props.setSourcePassword(event.target.value)
                }
                type="password"
                name="source-password"
                id="source-password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="col-span-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      checked={props.sourceSecure}
                      onChange={(event) =>
                        props.setSourceSecure(event.target.checked)
                      }
                      id="source-secure"
                      name="source-secure"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="source-secure"
                      className="font-medium text-gray-700"
                    >
                      Secure (SSL/TLS)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DestinationAccountCard(props: DestinationProps): ReactElement {
  function handleDestinationServerChange(event: any) {
    const value = event.target.value
    if (ipAddressRegex.test(value) || domainRegex.test(value)) {
      props.setDestinationServer(value)
      props.setDestinationServerError(null)
    } else {
      props.setDestinationServer(value)
      props.setDestinationServerError(
        'Invalid input. Please enter a valid IP address or domain name.'
      )
    }
  }

  return (
    <div className="rounded-lg bg-gray-50 px-4 py-5 shadow sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Destination Account
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Enter the IMAP details for the email account you&apos;d like to move
            messages to.
          </p>
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-4 sm:col-span-5">
              <label
                htmlFor="destination-hostname"
                className="block text-sm font-medium text-gray-700"
              >
                Server Hostname
              </label>
              <input
                value={props.destinationServer}
                onChange={handleDestinationServerChange}
                type="text"
                name="destination-hostname"
                id="destination-hostname"
                className={classNames(
                  props.destinationServerError
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                  'mt-1 block w-full rounded-md shadow-sm sm:text-sm'
                )}
              />
              {props.destinationServerError && (
                <p className="mt-2 text-sm text-red-500">
                  {props.destinationServerError}
                </p>
              )}
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="destination-port"
                className="block text-sm font-medium text-gray-700"
              >
                Port
              </label>
              <select
                value={props.destinationPort}
                onChange={(event) =>
                  props.setDestinationPort(Number(event.target.value))
                }
                id="destination-port"
                name="destination-port"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                {portOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="destination-username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                value={props.destinationUsername}
                onChange={(event) =>
                  props.setDestinationUsername(event.target.value)
                }
                type="text"
                name="destination-username"
                id="destination-username"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="destination-password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                value={props.destinationPassword}
                onChange={(event) =>
                  props.setDestinationPassword(event.target.value)
                }
                type="password"
                name="destination-password"
                id="destination-password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="col-span-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      checked={props.destinationSecure}
                      onChange={(event) =>
                        props.setDestinationSecure(event.target.checked)
                      }
                      id="destination-secure"
                      name="destination-secure"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="destination-secure"
                      className="font-medium text-gray-700"
                    >
                      Secure (SSL/TLS)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
