'use client'
import {useState , useEffect} from 'react'
import { useSession } from 'next-auth/react';
import { RiAdminLine } from "react-icons/ri";
import { MdOutlineLocalFireDepartment } from "react-icons/md";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiStudent } from "react-icons/pi";
import { MdOutlineSubject } from "react-icons/md";
const API = "api/v1/count/"
const CardArray = () => {
    const [type, setType] = useState(null)
    const [institution, setInstitution] = useState(null)
    const { data: session , status} = useSession()
    useEffect(() => {
        if (session) {
            setType(session.user.type)
            setInstitution(session.user.institution)
                    }
    }, [session , status])

    if(type && institution){
        switch (type) {
            case "ADMIN_INSTITUTION":
                return [
                    {
                        icon: RiAdminLine,
                        title: "admin",
                        api: API + institution +"/admin",
                    },
                    {
                        icon: MdOutlineLocalFireDepartment,
                        title: "department",
                        api: API + institution +"/department",
                    },
                    {
                        icon: MdOutlineSubject,
                        title: "subject",
                        api: API + institution +"/subject",
                    },
                    {
                        icon: FaChalkboardTeacher,
                        title: "teacher",
                        api: API + institution +"/teacher",
                    },
                    {
                        icon: PiStudent,
                        title: "student",
                        api: API + institution +"/student",
                    }
                ]
            case "ADMIN_REGISTER" || "ADMIN_SOCIAL" :
                return [
                    {
                        icon: FaChalkboardTeacher,
                        title: "teacher",
                        api: API + institution +"/teacher",
                    },
                    {
                        icon: PiStudent,
                        title: "student",
                        api: API + institution +"/student",
                    }
                ]
                case "TEACHER" || "PROFESSOR":
                    return [
                        {
                            icon: PiStudent,
                            title: "student",
                            api: API + institution +"/student",
                        }
                    ]
            default:
                return [
                    {
                        icon: PiStudent,
                        title: "student",
                        api: API + institution +"/student",
                    }
                ]
        }
    }
    
  
}

export default CardArray