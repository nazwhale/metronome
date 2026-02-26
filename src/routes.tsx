import HomePage from "./HomePage.tsx";
import Blog from "./Blog";
import Post from "./Blog/Post.tsx";
import Dictionary from "./Dictionary";
import TermPage from "./Dictionary/TermPage.tsx";
import All from "./All.tsx";
import EmbedMetronome from "./pages/embed/EmbedMetronome.tsx";
import EmbedSpeedTrainer from "./pages/embed/EmbedSpeedTrainer.tsx";
import EmbedYouTubeLooper from "./pages/embed/EmbedYouTubeLooper.tsx";
import EmbedChordTrainer from "./pages/embed/EmbedChordTrainer.tsx";
import EmbedMelodicDictation from "./pages/embed/EmbedMelodicDictation.tsx";

// Localized pages
import Metronomo from "./pages/es/Metronomo.tsx";
import Metronomi from "./pages/fi/Metronomi.tsx";
import BpmMetronomePage from "./pages/BpmMetronomePage.tsx";
import BpmMetronomoPage from "./pages/es/BpmMetronomoPage.tsx";
import BpmMetronomiPage from "./pages/fi/BpmMetronomiPage.tsx";

const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/articles",
    element: <Blog />,
  },
  {
    path: "/articles/:slug",
    element: <Post />,
  },
  {
    path: "/dictionary",
    element: <Dictionary />,
  },
  {
    path: "/dictionary/:slug",
    element: <TermPage />,
  },
  // Localized language routes (before BPM so /es/metronomo matches literally)
  {
    path: "/es/metronomo",
    element: <Metronomo />,
  },
  {
    path: "/es/metronomo/:bpm-bpm",
    element: <BpmMetronomoPage />,
  },
  {
    path: "/fi/metronomi",
    element: <Metronomi />,
  },
  {
    path: "/fi/metronomi/:bpm-bpm",
    element: <BpmMetronomiPage />,
  },
  ...All.map((metronome) => ({
    path: metronome.path,
    element: <metronome.component />,
  })),
  // BPM-specific routes under main metronome path (e.g. /online-metronome/100-bpm)
  {
    path: "/online-metronome/:bpm-bpm",
    element: <BpmMetronomePage />,
  },
  // Embed routes with query param support
  {
    path: "/embed/metronome",
    element: <EmbedMetronome />,
  },
  {
    path: "/embed/speed-trainer",
    element: <EmbedSpeedTrainer />,
  },
  {
    path: "/embed/youtube-looper",
    element: <EmbedYouTubeLooper />,
  },
  {
    path: "/embed/chord-trainer",
    element: <EmbedChordTrainer />,
  },
  {
    path: "/embed/melodic-dictation",
    element: <EmbedMelodicDictation />,
  },
];

export default routes;
