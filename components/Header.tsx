import Link from 'next/link'
import React from 'react'
import NavLinks from './NavLinks'
import SearchBox from './SearchBox'
import DarkModeButton from './DarkModeButton'
import SideMenu from './SideMenu'
import SubscribeBtn from './SubscribeBtn'
import { auth } from '@/auth'
import { checkIfSubscribed } from '@/actions/user'

async function Header() {
  const session = await auth();
  const user = session?.user;

  const email = user?.email || undefined;

  const isSubscribed = await checkIfSubscribed({ email });

  return (
    <header>
      <div className='grid grid-cols-3 p-10 items-center'>
        <SideMenu />
        <Link href='/' prefetch={false}>
          <div className='font-ttFors text-4xl text-center'>
            <h1>KEEPING UP</h1>
            <h1>W!TH LLIS</h1>
          </div>
        </Link>

        <div className='flex items-center justify-end space-x-2'>
          <DarkModeButton />
          <SubscribeBtn userEmail={email} isSubscribed={isSubscribed} />
        </div>
      </div>

      <NavLinks />

      <SearchBox />
    </header>
  )
}

export default Header