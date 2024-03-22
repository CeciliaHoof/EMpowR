import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react"
import { useContext } from "react";
import { UserContext } from "../context/user";
  
function NavMenu(){
    const { setUser } = useContext(UserContext)

    function handleLogout(){
        fetch('/logout', {
            method: 'DELETE'
        })
        setUser(null)
    }
    return(
        <Menu pointing vertical>
            <Menu.Item as={NavLink} to='/'>
                Dashboard
            </Menu.Item>
            <Menu.Item as={NavLink} to='/health_metrics'>
                Health Metrics
            </Menu.Item>
            <Menu.Item as={NavLink} to='/prescriptions'>
                Prescriptions
            </Menu.Item>
            <Menu.Item as={NavLink} to='/medications'>
                Medication Search
            </Menu.Item>
            <Menu.Item onClick={handleLogout}>
               Logout
            </Menu.Item>
        </Menu>
    )
}

export default NavMenu