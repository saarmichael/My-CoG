import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { IconWrapper } from './Styles';

interface ComponentScreenshotProps {
  content: React.ReactNode;
}

const ComponentScreenshot: React.FC<ComponentScreenshotProps> = ({ content }) => {
  const elementRef = useRef<HTMLDivElement | null>(null);

  const takeScreenshot = () => {
    const element = elementRef.current;

    if (element) {
      html2canvas(element).then((canvas) => {
        // Generated canvas image can be retrieved using `canvas.toDataURL()`
        const image = canvas.toDataURL();

        // To download the image
        const a = document.createElement("a");
        a.href = image;
        a.download = 'screenshot.png';
        a.click();
      });
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <div ref={elementRef}>
        {content}
      </div>
      <button
        onClick={takeScreenshot}
        style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          backgroundColor: 'transparent'
        }}
      >
        <IconWrapper>
          <CameraAltIcon style={{ color: 'purple', }} />
        </IconWrapper>
      </button>
    </div>
  )
}

export default ComponentScreenshot;
