import Link from 'next/link'
import Image from 'next/image';

export default function Logo() {
  return (
    <Link href="/" className="block">
      <Image src={"/images/nobglogo.png"} alt="Home" width="60" height="60" />
    </Link>
  )
}
