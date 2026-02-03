import StandardMetronome from "./Metronomes/Standard.tsx";
import Blog from "./Blog";
import Post from "./Blog/Post.tsx";
import All from "./All.tsx";
import EmbedMetronome from "./pages/embed/EmbedMetronome.tsx";
import EmbedSpeedTrainer from "./pages/embed/EmbedSpeedTrainer.tsx";
import EmbedYouTubeLooper from "./pages/embed/EmbedYouTubeLooper.tsx";
import EmbedChordTrainer from "./pages/embed/EmbedChordTrainer.tsx";
import EmbedMelodicDictation from "./pages/embed/EmbedMelodicDictation.tsx";

const routes = [
  {
    path: "/",
    element: <StandardMetronome />,
  },
  {
    path: "/articles",
    element: <Blog />,
  },
  {
    path: "/articles/:slug",
    element: <Post />,
  },
  ...All.map((metronome) => ({
    path: metronome.path,
    element: <metronome.component />,
  })),
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
