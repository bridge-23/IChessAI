import { Hash } from "viem"
import { useWaitForTransactionReceipt } from "wagmi"
import  VerifyTransaction  from "./VerifyTransaction"

interface ConfirmationProps {
  hash: Hash;
  item: string;
}

const Confirmation: React.FC<ConfirmationProps> =({ item, hash }) => {
  const { data, isError, error, isLoading } = useWaitForTransactionReceipt({
    hash,
    confirmations: 6, // 6 confirmations for be sure that the transaction is confirmed
  })

  if (isError && error) {
    return <div>Transaction error {error.toString()}</div>
  } else if (isLoading) {
    return <div>Waiting for confirmation…</div>
  } else if (data) {
    return <VerifyTransaction hash={hash.toString()} item={item} />
  } else {
    return null
  }
}

export default Confirmation