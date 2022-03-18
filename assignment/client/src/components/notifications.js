import { Container } from 'reactstrap'
import Toggleswitch from './toggleSwitch'


function Notifications() {
  return (
    <div className="backgroundImage">
      <h2>Notifications</h2>
      <Container className='notificationBox' fluid={true}>
        <Toggleswitch/>
      </Container>
    </div>
  )
}

export default Notifications
