import { Link, Button } from "@nextui-org/react";
const SidebarItem = ({isActive , title , href ,icon}) => {
    return (
    <Button
      href={href}
      as={Link}
      color={isActive ? "success" : "default"}
      variant={isActive ? "solid" : "light"}
      startContent={icon}
      className='w-full my-2 flex justify-start items-center px-4 rounded-md text-xl capitalize'
    >
      {title}
    </Button>
  )
}

export default SidebarItem