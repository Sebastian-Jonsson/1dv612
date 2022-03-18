import { Container } from 'reactstrap'
import DashboardContents from './dashboardContents'

function Dashboard(props) {
  return (
    <div className="backgroundImage">
      <h2>Dashboard</h2>
      <Container className='dashboardBox' fluid={true}>
        <DashboardContents userId={props.userId}/>
      </Container>
    </div>
  )
}

export default Dashboard
