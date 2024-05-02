'use client'
import {useState , useEffect} from 'react'
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { BsFilePost } from "react-icons/bs";
import { BiSolidDashboard } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { LiaUniversitySolid } from "react-icons/lia";
import { IoSettingsOutline } from "react-icons/io5";
import { IoBookOutline } from "react-icons/io5";
import { CiCircleList } from "react-icons/ci";

const itemArray = () => {
    const [type, setType] = useState(null)
    const { data: session } = useSession()
    const pathname = usePathname()
    useEffect(() => {
        if (session) {
            setType(session.user.type)
        }
    }, [session])
    switch (type) {
        case "ADMIN_INSTITUTION":
            return [
                {
                    icon: <BsFilePost />,
                    title: "post",
                    href: "/",
                    active: pathname === "/",
                },
                {
                    icon: <BiSolidDashboard />,
                    title: "dashboard",
                    href: "/dashboard",
                    active: pathname === "/dashboard",
                
                },{
                    icon: <LiaUniversitySolid />,
                    title: "institution",
                    href: "/institution",
                    active: pathname === "/institution",
                },
                {
                    icon: <IoSettingsOutline />,
                    title: "setting",
                    href: "/setting",
                    active: pathname === "/setting",
                },
            ]
        case "ADMIN_REGISTER":
            return [
                {
                    icon: <BsFilePost />,
                    title: "post",
                    href: "/",
                    active: pathname === "/",
                },
                {
                    icon: <BiSolidDashboard />,
                    title: "dashboard",
                    href: "/dashboard",
                    active: pathname === "/dashboard",
                },{
                    icon: <LiaUniversitySolid />,
                    title: "institution",
                    href: "/institution",
                    active: pathname === "/institution",
                },
                {
                    icon: <CgProfile />,
                    title: "profile",
                    href: "/profile",
                    active: pathname === "/profile",
                },
                {
                    icon: <IoSettingsOutline />,
                    title: "setting",
                    href: "/setting",
                    active: pathname === "/setting",
                },
            ]
            case "TEACHER":
            return [
                {
                    icon: <BsFilePost />,
                    title: "post",
                    href: "/",
                    active: pathname === "/",
                },{
                    icon: <LiaUniversitySolid />,
                    title: "institution",
                    href: "/institution",
                    active: pathname === "/institution",
                },
                {
                    icon: <CgProfile />,
                    title: "profile",
                    href: "/profile",
                    active: pathname === "/profile",
                },
                {
                    icon: <IoSettingsOutline />,
                    title: "setting",
                    href: "/setting",
                    active: pathname === "/setting",
                },
                {
                    icon: <IoBookOutline />,
                    title: "subject",
                    href: "/subject",
                    active: pathname === "/subject",
                }
            ]
            case "PROFESSOR":
            return [
                {
                    icon: <BsFilePost />,
                    title: "post",
                    href: "/",
                    active: pathname === "/",
                },{
                    icon: <LiaUniversitySolid />,
                    title: "institution",
                    href: "/institution",
                    actTive: pathname === "/institution",
                },
                {
                    icon: <CgProfile />,
                    title: "profile",
                    href: "/profile",
                    active: pathname === "/profile",
                },
                {
                    icon: <IoSettingsOutline />,
                    title: "setting",
                    href: "/setting",
                    active: pathname === "/setting",
                },
                {
                    icon: <IoBookOutline />,
                    title: "subject",
                    href: "/subject",
                    active: pathname === "/subject",
                }
            ]
        case "STUDENT":
            return [
                {
                    icon: <BsFilePost />,
                    title: "post",
                    href: "/",
                    active: pathname === "/",
                },{
                    icon: <LiaUniversitySolid />,
                    title: "institution",
                    href: "/institution",
                    active: pathname === "/institution",
                },
                {
                    icon: <CgProfile />,
                    title: "profile",
                    href: "/profile",
                    active: pathname === "/profile",
                },
                {
                    icon: <IoSettingsOutline />,
                    title: "setting",
                    href: "/setting",
                    active: pathname === "/setting",
                },
                {
                    icon: <IoBookOutline />,
                    title: "subject",
                    href: "/subject",
                    active: pathname === "/subject",
                },{
                    icon: <CiCircleList />,
                    title: "take",
                    href: "/take",
                    active: pathname === "/take",
                
                }
            ]
        default:
            return [
                {
                    icon: <BsFilePost />,
                    title: "Post",
                    href: "/",
                    active: pathname === "/",
                },
            ]
    }
  
}

export default itemArray