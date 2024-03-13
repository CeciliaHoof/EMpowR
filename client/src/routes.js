import App from './components/App';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Medications from './pages/Medications';
import Prescriptions from './pages/Prescriptions';
import ErrorPage from './pages/ErrorPage'
import MedicationDetails from './components/MedicationDetails'
import PrescriptionDetails from './components/PrescriptionDetails';


const routes = [
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/',
                element: <Dashboard />,
            },
            {
                path: '/medications',
                element: <Medications />
            },
            {
                path: '/prescriptions',
                element: <Prescriptions />
            },
            {
                path: '/medications/:id',
                element: <MedicationDetails />
            },
            {
                path: '/prescriptions/:id',
                element: <PrescriptionDetails />
            }

        ]
    }
];

export default routes;