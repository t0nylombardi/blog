import Head from 'next/head';
import { useState, useEffect } from 'react';
import SidePanel from '../SidePanel/SidePanel';
import { useSpring, animated, config } from 'react-spring';
import BackToMenu from '../BackToMenu';

const MainLayout = ({ children, route }) => {
  const [isExpanded, setExpanded] = useState(true);
  const [isVisable, setVisable] = useState(false);

  const style = useSpring({
    width: isExpanded ? '100vw' : '0px',
    opacity: isExpanded ? '1' : '0',
    config: config.wobbly,
  });

  const setButtonHandler = () => {
    setExpanded(!isExpanded);
    setVisable(!isVisable);
  };

  useEffect(() => {
    console.log('router', route);
    if (route == '/posts/[slug]' || route == '/resume') {
      setExpanded(!isExpanded);
      setVisable(!isVisable);
    }
  }, []);

  return (
    <div className="Layout">
      <BackToMenu onChildClick={setButtonHandler} isVisable={isVisable} />
      <Head key="main">
        <link rel="shortcut icon" href="/assets/favicon.ico" />
        <meta name="description" content="t0nylombardi.com blog" />
        <meta name="author" content="t0nylombardi" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <title>T0nyLombardi | BLOG</title>
      </Head>

      <div className="flex flex-wrap flex-col h-screen">
        <div className="">
          <animated.div style={style}>
            <SidePanel onChildClick={setButtonHandler} />
          </animated.div>
        </div>

        <div
          className={`w-full lg:w-3/4 overflow-hidden ${
            isExpanded ? 'hidden' : 'flex'
          }`}
        >
          <div className="blog-wrapper w-full overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
