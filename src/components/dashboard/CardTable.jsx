'use client'
import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Card, CardBody, Spinner } from '@nextui-org/react';
import TableCustomize from './TableCustomize';
import ItemDepartment from './itemModal/ItemDepartment';
import ItemHour from './itemModal/ItemHour';
import CreateAdminModel from './itemModal/CreateAdminModel';
import ItemSemester from './itemModal/ItemSemester';
import ItemSubject from './itemModal/ItemSubject';
import ItemTake from './itemModal/ItemTake';
import ItemYear from './itemModal/ItemYear';
import { useSession } from 'next-auth/react';
const tabsConfig = [
    { title: 'user', WrapComponent: CreateAdminModel, idModal: 'admin', ColsShow: ['image', 'type', 'gender', 'birth'], arrayCols: [{ label: 'User', key: 'image', sortable: true }, { label: 'Type', key: 'type', sortable: true }, { label: 'Gender', key: 'gender', sortable: true }, { label: 'Birth', key: 'birth', sortable: true }], api: 'user' },
    { title: 'department', WrapComponent: ItemDepartment, idModal: 'department', ColsShow: ['name', 'hours'], arrayCols: [{ label: 'Name', key: 'name', sortable: true }, { label: 'Hours', key: 'hours', sortable: true }], api: 'department' },
    { title: 'subject', WrapComponent: ItemSubject, idModal: 'subject', ColsShow: ['name', 'code'], arrayCols: [{ label: 'Name', key: 'name', sortable: true }, { label: 'Code', key: 'code' }], api: 'subject' },
    { title: 'year', WrapComponent: ItemYear, idModal: 'year', ColsShow: ['name'], arrayCols: [{ label: 'Name', key: 'name', sortable: true }], api: 'year' },
    { title: 'semester', WrapComponent: ItemSemester, idModal: 'semester', ColsShow: ['name', 'year.name'], arrayCols: [{ label: 'Name', key: 'name', sortable: true }, { label: 'Year', key: 'year.name', sortable: true }], api: 'semester' },
    { title: 'hour', WrapComponent: ItemHour, idModal: 'hour', ColsShow: ['price', 'department.name', 'year.name', 'semester.name'], arrayCols: [{ label: 'Price', key: 'price', sortable: true }, { label: 'Department', key: 'department.name', sortable: true }, { label: 'Year', key: 'year.name', sortable: true }, { label: 'Semester', key: 'semester.name', sortable: true }], api: 'hour' },
    { title: 'take', WrapComponent: ItemTake, idModal: 'take', ColsShow: ['hour.price', 'optional', 'hourCount', 'department.name', 'subject.name', 'year.name', 'semester.name'], arrayCols: [{ label: 'Price', key: 'hour.price', sortable: true }, { label: 'Hour Count', key: 'hourCount', sortable: true }, { label: 'optional', key: 'optional', sortable: true }, { label: 'Department Name', key: 'department.name', sortable: true }, { label: 'Subject Name', key: 'subject.name', sortable: true }, { label: 'Year', key: 'year.name', sortable: true }, { label: 'Semester', key: 'semester.name', sortable: true }], api: 'take' }
];

const CardTable = () => {
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    useEffect(() => {
        setLoading(false);
    }, []);

    return loading ? (
        <Spinner color='success' size='lg' label='Loading...' />
    ) :  (
            (session.user.type === "ADMIN_INSTITUTION")? (
                    <Tabs fullWidth aria-label="Options" color='success' variant='underlined' className='w-full  flex flex-col justify-start items-center' >
                        {tabsConfig.map(({ title, WrapComponent, idModal, ColsShow, arrayCols, api }) => (
                            <Tab key={title} title={title} className='w-full flex flex-col justify-start items-center gap-6'>
                                <Card className='w-full' isBlurred>
                                    <TableCustomize Wrap={WrapComponent} idModal={idModal} ColsShow={ColsShow} arrayCols={arrayCols} api={api} />
                                </Card>
                            </Tab>
                        ))}
                    </Tabs>
            ): null
            
    );
};

export default CardTable;
