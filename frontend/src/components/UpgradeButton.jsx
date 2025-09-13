import { useAuth } from '../context/AuthContext'

export default function UpgradeButton({ onUpgrade }) {
  const { user } = useAuth()

  if (user.tenant.plan === 'pro') {
    return (
      <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md">
        Pro Plan Activated
      </div>
    )
  }

  return (
    <button
      onClick={onUpgrade}
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
    >
      Upgrade to Pro
    </button>
  )
}