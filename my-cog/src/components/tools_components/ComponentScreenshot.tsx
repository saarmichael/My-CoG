import CameraAltIcon from '@mui/icons-material/CameraAlt';
import html2canvas from 'html2canvas';
import React, { useContext, useRef } from 'react';
import { GlobalDataContext, IGlobalDataContext } from '../../contexts/ElectrodeFocusContext';
import { IconWrapper } from './Styles';

interface ComponentScreenshotProps {
  content: React.ReactNode;
  showDetails?: boolean;
}

const ComponentScreenshot: React.FC<ComponentScreenshotProps> = ({ content, showDetails }) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const {
    freqRange,
    timeRange,
    connectivityType,
  } = useContext(GlobalDataContext) as IGlobalDataContext;

  const takeScreenshot = () => {
    const element = elementRef.current;

    if (element) {
      html2canvas(element).then((htmlCanvas) => {
        // Create a new canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context) {
          // Set the dimensions to match the htmlCanvas
          canvas.width = htmlCanvas.width;
          canvas.height = htmlCanvas.height;

          // Draw the htmlCanvas onto the new canvas
          context.drawImage(htmlCanvas, 0, 0);
          if (showDetails) {
            // Now write the text on top
            context.fillStyle = 'black';
            context.font = '30px Arial';
            let details = [
              `Connectivity type: ${connectivityType}`,
              `Time range: ${timeRange.start} : ${timeRange.end}`,
              `Frequency range: ${freqRange.min} : ${freqRange.max}`
            ];

            const lineHeight = 40;
            const textX = 5;
            let textY = 30;

            details.forEach((line) => {
              context.fillText(line, textX, textY);
              textY += lineHeight;
            });
          }
          const image = canvas.toDataURL();
          const a = document.createElement('a');
          a.href = image;
          a.download = 'screenshot.png';
          a.click();
        }
      });
    }
  };





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
