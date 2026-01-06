import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LearnReactLayout } from "../layouts/LearnReactLayout";
import HomePage from "../pages/HomePage";
import { UseActionStatePage } from "../pages/use-action-state";
import { UseCallbackPage } from "../pages/use-callback";
import { UseContextPage } from "../pages/use-context";
import { UseFormStatusPage } from "../pages/use-form-status";
import { UseIdPage } from "../pages/use-id";
import { UseRefPage } from "../pages/use-ref";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LearnReactLayout />}>
          <Route index element={<HomePage />} />
          {/* useId */}
          <Route
            path="/use-id"
            element={<UseIdPage />}
          />
          {/* useRef */}
          <Route
            path="/use-ref"
            element={<UseRefPage />}
          />
          {/* useActionState */}
          <Route
            path="/use-action-state"
            element={<UseActionStatePage />}
          />
          <Route
          // useFormStatus
            path="/use-form-status"
            element={<UseFormStatusPage />}
          />
          <Route
          // useCallback
            path="/use-callback"
            element={<UseCallbackPage />}
          />
          <Route
          // useContext 
            path="/use-context"
            element={<UseContextPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
