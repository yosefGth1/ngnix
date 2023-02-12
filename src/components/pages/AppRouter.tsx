import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./HomePage/HomePage";
import GalleryPage from "./GalleryPage/GalleryPage";
import PreviewPage from "./PreviewPage/PreviewPage";
import NotFoundPage from "./NotFoundPage/NotFoundPage";
import SettingsPage from "./SettingsPage/SettingsPage";
import ProfilePage from "./ProfilePage/ProfilePage";

const AppRouter = (): JSX.Element => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="gallery" element={<GalleryPage />} />
                <Route path="preview" element={<PreviewPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;