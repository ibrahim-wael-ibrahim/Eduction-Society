'use client'
import React from 'react'
import {useSession} from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { Avatar, Dropdown, DropdownMenu, DropdownTrigger ,DropdownItem , Link} from '@nextui-org/react'
const RegisterNavbar = () => {
  const { data: session } = useSession()
  return (
    <>
    <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              className="transition-transform "
              name={session?.user?.name || 'User'}
              size="sm"
              src={session?.user?.image || ''}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" >
    {
      session.user.type !== "ADMIN_INSTITUTION" && (
        <DropdownItem aria-label='profile'><Link href='/profile' variant="flat" color='foreground' showAnchorIcon> profile</Link></DropdownItem>

      )
    }
            <DropdownItem aria-label='setting'><Link href='/setting' variant="flat" color='foreground' showAnchorIcon> Settings</Link></DropdownItem>
            <DropdownItem aria-label='logout' onClick={() => signOut()}>Logout</DropdownItem>


          </DropdownMenu>
        </Dropdown>
    </>
  )
}

export default RegisterNavbar