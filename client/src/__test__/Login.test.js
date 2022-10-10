import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import Login from '../features/auth/Login';

describe('test login component', () => {
    
    test('render 2 inputs', async () => {
        render(
            <Router>
                <Login />
            </Router>
        );
        const inputList = await screen.findAllByRole('input');
        expect(inputList).toHavelength(2);
    });
})