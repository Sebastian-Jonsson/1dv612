import { useEffect, useState } from "react"
import axios from 'axios'


function Toggleswitch() {
    const [commit, setCommit] = useState(true);
    const [release, setRelease] = useState(true);

    const switchPath = 'api/v1/notifications'

    useEffect((e) => {
        axios.get()
    }, [])
    
    const toggleFunction = (choice) => {
        if (choice === 'NewReleases') {
            setRelease(!release)
            axios.get(`${switchPath}/new-releases`)
        }
        if (choice === 'NewCommits') {
            setCommit(!commit)
            axios.get(`${switchPath}/new-commits`)
        }
    }


    return (
        <div>
            <center>
                <h3>Settings(Not Yet Implemented)</h3>
                <label>Show New Releases</label>
                <input type='checkbox' name='NewReleases' onClick={() => toggleFunction('NewReleases')}></input>
            </center>
            <center>
                <label>Show New Commits</label>
                <input type='checkbox' name='NewCommits' onClick={() => toggleFunction('NewCommits')}></input>
            </center>
            <center>
                 
            </center>
        </div>
    )
}


export default Toggleswitch
