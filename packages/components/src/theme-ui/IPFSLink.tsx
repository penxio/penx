import { ExternalLink } from 'lucide-react'
import { cn } from '@penx/utils'

interface Props {
  className?: string
  cid: string
}

export function IPFSLink({ cid, className }: Props) {
  if (!cid) return null
  return null
  // return (
  //   <div className="text-foreground/60 text-xs rounded-md py-2 md:flex items-center gap-2 hidden">
  //     <span className="text-foreground/80">IPFS CID:</span>
  //     <span>{cid}</span>
  //     <a
  //       className="inline-flex"
  //       href={`https://ipfs-gateway.spaceprotocol.xyz/ipfs/${.cid}`}
  //       target="_blank"
  //     >
  //       <ExternalLink className="cursor-pointer" size={12} />
  //     </a>
  //   </div>
  // )
}
