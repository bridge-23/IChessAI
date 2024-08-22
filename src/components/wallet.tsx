import { useAccount, useConnect, useDisconnect } from "wagmi"
import { injected } from 'wagmi/connectors'

interface WalletProps {}

const Wallet: React.FC<WalletProps> = ({}) => {
  const { address } = useAccount()
  const { connect } = useConnect({})

  const { disconnect } = useDisconnect()

  if (address)
    return (
      <main>
        Connected to: {address}
        <br />
    <br />
        <button onClick={() => disconnect()}>Disconnect</button>
      </main>
    )
  return <button onClick={() => connect({ connector:  injected({ target: 'metaMask' })})}>Connect Wallet</button>
}

export default Wallet