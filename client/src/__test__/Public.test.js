import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Public} from '../components/Public'
import {BrowserRouter, MemoryRouter} from 'react-router-dom'

test('public page rendering/navigating', async () => {
  render(<Public />, {wrapper: BrowserRouter})
  const user = userEvent.setup()

  // verify page content for public page
  expect(screen.getByText(/Bienvenue sur GroupoNet!/i)).toBeInTheDocument()

  // verify page content after clicking on the logo image
  await user.click(screen.getByRole('img'))
  expect(screen.getByText(/Connexion/i)).toBeInTheDocument()
})

// test('render 2 inputs and 1 button', async () => {
//   render(
//       <Router>
//           <Login />
//       </Router>
//   );
//   const inputList = await screen.findAllByRole('input');
//   expect(inputList).toHavelength(2);
//   const btnList = await screen.findAllByRole('button');
//   expect(btnList).toHavelength(1);
// });