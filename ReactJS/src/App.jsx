import { BrowserRouter, Route, Routes } from 'react-router-dom';
import routers from './routers/router';
import { Suspense } from 'react';

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    {routers.map((item, index) => (
                        <Route
                            path={item.path}
                            element={<item.component />}
                            key={index}
                        />
                    ))}
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
