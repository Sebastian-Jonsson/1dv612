import axios from 'axios'
import io from 'socket.io-client'
import { useEffect, useState } from "react"
import { ListGroup, 
        ListGroupItem
     } from 'reactstrap'
     
function DashboardContents(props) {
    const [notificationList, setNotificationList] = useState([])
    const [groupList, setGroupList] = useState([])
    const [groupSelected, setGroupSelected] = useState()
    const [hookSelect, setHookSelect] = useState('')
    const [ddShow, setDdShow] = useState(false)
    

   // https://blog.campvanilla.com/reactjs-dropdown-menus-b6e06ae3a8fe
   // https://stackoverflow.com/questions/57418523/how-can-i-append-an-item-to-an-array-in-a-react-component-using-hooks
    useEffect(() => {
        axios.get('/api/v1/notifications/getMissedNotifications').then(resp => {
            setNotificationList((notificationList) => [...notificationList, ...resp.data])
        })
        axios.get('/api/v1/notifications/getGroups').then(resp => {
                setGroupList(resp.data.groupInfo)
            }
        )
        },[]
    )

    useEffect(() => {
        const socket = io.connect('')
        socket.on('userConnected', () => {
            socket.emit('socketLogin', {userId: props.userId})
        })
        socket.on('notification', emitData => {
            setNotificationList((notificationList) => [...notificationList, emitData])
        })
    },[props.userId]
    )

    const showDropdown = (e) => {
        e.preventDefault()
        console.log(notificationList)

        setDdShow(!ddShow)
    }

    const groupSelect = (id, name) => {
        console.log(id)
        axios.put('/api/v1/notifications/groupSelection', { groupId: id, groupName: name })
        .then((res) => {
            console.log(res.data)
            setGroupSelected(res.data)
        })
    }

    const dropdownGroups = () => {
        return (
            <div>                
                {
                ddShow
                    ? (
                    <div className="dropdownMenu">
                        {groupList.map((group, key) => {
                            return (
                            <button key={key} value={group.id} onClick={() => groupSelect(group.id, group.groupName)}>{group.groupName}</button>
                            )
                        })}
                    </div>
                    )
                    : (
                    null
                    )
                }
            </div>
        )
    }

    const hookSelector = (e) => {
        e.preventDefault()

        axios.put('/api/v1/notifications/addDiscordUrl', { hookUrl: hookSelect})
        .then((res) => {
            setHookSelect(res.data)
        })
    }

    const hookValue = (e) => {
        setHookSelect(e.target.value)
    }

    const hookForm = () => {
        return (
            <div className="hookForm">
                <center>
                    <form onSubmit={hookSelector}>
                    <label>
                        Discord Hook:
                        <input type="text" value={hookSelect} onChange={hookValue} />
                    </label>
                    <input type="submit" value="Submit" />
                    </form>
                </center>
            </div>
        )
    }

    return (
    <div className="notificationContents">
        {hookForm()}
        <center>
        <button onClick={showDropdown}>
        Show Groups
        </button>
            {dropdownGroups()}
        </center>
        <center>
            <h3>{groupSelected}</h3>
        </center>
        <ListGroup>
            <div className="notificationBox">
                <center>Latest</center>
            {notificationList.reverse().map((notification, key) => {
                return (
                    <ListGroupItem key={key}>
                        <center>
                            <p>{notification.data}</p>
                        </center>
                    </ListGroupItem>
                )
            })}
            <center>Oldest</center>
            </div>
        </ListGroup>

    </div>
    )
}


export default DashboardContents
