import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react"

function NavMenu(){
    return(
        <Menu pointing vertical>
            <Menu.Item as={NavLink} to='/'>
                Dashboard
            </Menu.Item>
            <Menu.Item as={NavLink} to='/prescriptions'>
                Your Prescriptions
            </Menu.Item>
            <Menu.Item as={NavLink} to='/medications'>
                Medication Search
            </Menu.Item>
        </Menu>
    )
}

export default NavMenu