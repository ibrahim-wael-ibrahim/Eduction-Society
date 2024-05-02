'use client'
import React from "react";
import {
    Navbar,
    NavbarContent,
    Input,
    Link,
    Button,
    ButtonGroup,
    Skeleton,
  } from "@nextui-org/react";
  import ThemeSwitcher from "../UI/ThemeSwitcher";
  import RegisterNavbar from "./Register-navbar";
import { SearchIcon } from "../icons/SearchIcon";
import { useSession } from "next-auth/react";
const NavbarSection = () => {
    const {data: session , status} = useSession()
    const loading = ()=> {return       <div>
      <Skeleton className="flex rounded-lg w-32 h-10"/>
    </div> }
  return (
    <>
     <Navbar >
      <NavbarContent justify="start">
      <Input
          classNames={{
            base: " max-w-[10rem] sm:max-w-full h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
          variant="flat"
          color="success"
          radius="sm"
        />
        <ThemeSwitcher/>

      </NavbarContent>

      <NavbarContent  justify="center">
        {(status === "loading")?        
          loading()
         : session ? <RegisterNavbar/> : (
                <ButtonGroup className=" uppercase">
                    <Button color="success" variant="flat" as={Link} href="/login">
                        login
                    </Button>
                    <Button color="success" variant="light" as={Link} href="/register">
                        register
                    </Button>
                </ButtonGroup>
        ) }
      </NavbarContent>
    </Navbar>
  </>
  );
};

export default NavbarSection;
