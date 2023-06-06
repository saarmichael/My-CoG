import { Card, CardContent, Typography } from "@mui/material";

interface SimpleCardProps {
  content: JSX.Element;
}

const SimpleCard: React.FC<SimpleCardProps> = ({ content }) => {
  return (
    <Card style={{ marginBottom: '0px', marginTop: '0px' }}>
      <CardContent style={{ padding: '5px' }}>
          {content}
      </CardContent>
    </Card>
  );
};

export default SimpleCard;
