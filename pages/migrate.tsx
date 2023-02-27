import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { ArrowLongDownIcon } from '@heroicons/react/20/solid'
import Confetti from 'react-confetti'
import Layout from '@/components/Layout'

const ipAddressRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
const domainRegex = /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*\.[a-zA-Z]{2,}$/

const Migrate = () => {
  const [sourceServer, setSourceServer] = useState<string>('')
  const [sourceServerError, setSourceServerError] = useState<any>(null)
  const [sourcePort, setSourcePort] = useState<number>(993)
  const [sourceUsername, setSourceUsername] = useState<string>('')
  const [sourcePassword, setSourcePassword] = useState<string>('')
  const [sourceSecure, setSourceSecure] = useState<boolean>(true)

  function handleSourceServerChange(event: any) {
    const value = event.target.value
    if (ipAddressRegex.test(value) || domainRegex.test(value)) {
      setSourceServer(value)
      setSourceServerError(null)
    } else {
      setSourceServer(value)
      setSourceServerError(
        'Invalid input. Please enter a valid IP address or domain name.'
      )
    }
  }

  const [destinationServer, setDestinationServer] = useState<string>('')
  const [destinationServerError, setDestinationServerError] =
    useState<any>(null)
  const [destinationPort, setDestinationPort] = useState<number>(993)
  const [destinationUsername, setDestinationUsername] = useState<string>('')
  const [destinationPassword, setDestinationPassword] = useState<string>('')
  const [destinationSecure, setDestinationSecure] = useState<boolean>(true)

  function handleDestinationServerChange(event: any) {
    const value = event.target.value
    if (ipAddressRegex.test(value) || domainRegex.test(value)) {
      setDestinationServer(value)
      setDestinationServerError(null)
    } else {
      setDestinationServer(value)
      setDestinationServerError(
        'Invalid input. Please enter a valid IP address or domain name.'
      )
    }
  }

  const [successMessage, setSuccessMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const [loading, setLoading] = useState<boolean>(false)

  const loadingList: any = useMemo(
    () => [
      'Working. Please wait...',
      'Still working...',
      'This may take a bit...',
      'Just a little while longer...',
      'Almost there...',
      'Moving lots of messages...',
      'Hang tight...'
    ],
    []
  )

  const [loadingIndex, setLoadingIndex] = useState(0)

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (loading) {
      intervalId = setInterval(() => {
        setLoadingIndex(
          (loadingIndex) => (loadingIndex + 1) % loadingList.length
        )
      }, 20000)
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [loading, loadingList])

  const portOptions = [
    { label: '143', value: 143 },
    { label: '993', value: 993 }
  ]

  const handleMigrate = async () => {
    let response: any | null = null

    try {
      setLoading(true)
      response = await axios.post<{ message: string }>('/api/migrate', {
        sourceServer,
        sourcePort,
        sourceUsername,
        sourcePassword,
        sourceSecure,
        destinationServer,
        destinationPort,
        destinationUsername,
        destinationPassword,
        destinationSecure
      })

      setSuccessMessage(response.data.message)
      setTimeout(() => setSuccessMessage(''), 10000)

      setSourceServer('')
      setSourcePort(993)
      setSourceUsername('')
      setSourcePassword('')
      setSourceSecure(true)

      setDestinationServer('')
      setDestinationPort(993)
      setDestinationUsername('')
      setDestinationPassword('')
      setDestinationSecure(true)
    } catch (error: any) {
      setErrorMessage(
        'An error occurred. Please double check the information provided and try again.'
      )
      setTimeout(() => setErrorMessage(''), 10000)
    } finally {
      setLoading(false)
      setLoadingIndex(0)
    }
  }

  function classNames(...classes: Array<string>) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <Layout title="Migrate Email">
      {successMessage && <Confetti />}
      <div className="space-y-6">
        <div className="rounded-lg bg-gray-50 px-4 py-5 shadow sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Source Account
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Enter the IMAP details for the email account you&apos;d like to
                move messages from.
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
                    value={sourceServer}
                    onChange={handleSourceServerChange}
                    type="text"
                    name="source-hostname"
                    id="source-hostname"
                    className={classNames(
                      sourceServerError
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                      'mt-1 block w-full rounded-md shadow-sm sm:text-sm'
                    )}
                  />
                  {sourceServerError && (
                    <p className="mt-2 text-sm text-red-500">
                      {sourceServerError}
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
                    value={sourcePort}
                    onChange={(event) =>
                      setSourcePort(Number(event.target.value))
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
                    value={sourceUsername}
                    onChange={(event) => setSourceUsername(event.target.value)}
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
                    value={sourcePassword}
                    onChange={(event) => setSourcePassword(event.target.value)}
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
                          checked={sourceSecure}
                          onChange={(event) =>
                            setSourceSecure(event.target.checked)
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

        <div className="my-5">
          <ArrowLongDownIcon className="mx-auto flex h-10 w-10 justify-center text-gray-400" />
        </div>

        <div className="rounded-lg bg-gray-50 px-4 py-5 shadow sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Destination Account
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Enter the IMAP details for the email account you&apos;d like to
                move messages to.
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
                    value={destinationServer}
                    onChange={handleDestinationServerChange}
                    type="text"
                    name="destination-hostname"
                    id="destination-hostname"
                    className={classNames(
                      destinationServerError
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                      'mt-1 block w-full rounded-md shadow-sm sm:text-sm'
                    )}
                  />
                  {destinationServerError && (
                    <p className="mt-2 text-sm text-red-500">
                      {destinationServerError}
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
                    value={destinationPort}
                    onChange={(event) =>
                      setDestinationPort(Number(event.target.value))
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
                    value={destinationUsername}
                    onChange={(event) =>
                      setDestinationUsername(event.target.value)
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
                    value={destinationPassword}
                    onChange={(event) =>
                      setDestinationPassword(event.target.value)
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
                          checked={destinationSecure}
                          onChange={(event) =>
                            setDestinationSecure(event.target.checked)
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

        <div className="flex items-center justify-end">
          {errorMessage && (
            <p className="text-sm font-medium text-red-500">{errorMessage}</p>
          )}
          <button
            onClick={handleMigrate}
            disabled={loading || sourceServerError !== null}
            className={classNames(
              loading
                ? 'bg-yellow-500'
                : successMessage
                ? 'bg-green-500'
                : 'bg-blue-600 hover:bg-blue-700',
              'ml-3 inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            )}
          >
            {loading ? (
              <>
                <svg
                  className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>{' '}
                {loadingList[loadingIndex]}
              </>
            ) : successMessage ? (
              'Migration completed!'
            ) : (
              'Start Migration'
            )}
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default Migrate
