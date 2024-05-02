"use client";

import {useTheme} from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { MoonIcon } from "../icons/MoonIcon";
import {SunIcon} from "../icons/SunIcon";

export default function ThemeSwitcher() {

  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted) return null
  const themeChange = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }
  const icon = theme === 'dark' ? <SunIcon/> : <MoonIcon/>
  
  return (
      <Button isIconOnly onClick={themeChange} color="" variant={"shadow"}>
      {icon}
      </Button> 
  );
}