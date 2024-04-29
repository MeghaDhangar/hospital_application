"use client"
import { Grid, Card, CardContent, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import { CardActionArea} from '@mui/material';
import {welcome} from '@/helpers/welcome'
import Image from 'next/image';

export default function Cards() {
  const glass={
    background: 'rgba( 19, 41, 61, 0.05 )',
    boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
    backdropFilter: 'blur( 3.5px )',
    WebkitBackdropFilter: 'blur( 3.5px )',
    borderRadius: '10px',
    border:' 1px solid rgba( 255, 255, 255, 0.18 )',
  }
  // const imageStyles = {
  //   backgroundColor: '#13293D40', 
  //   filter: 'brightness(0.5)',
  // };
  return (
    <div>
      <Container maxWidth="lg">
        <Typography variant='h3' align='center' color='primary' style={{ marginTop: "50px" }}>
          Centre of Excellence
        </Typography>
        <Grid container spacing={5}  style={{ marginTop: "20px" }}>
          {welcome.map((result, index) => (
            <Grid key={index} item xs={12} md={3} sm={4}>
              <Card sx={{ maxWidth: 345 }} style={glass} >
                <CardActionArea sx={{textAlign:'center'}} style={{ paddingTop: '15px'}}>
                
                    <Image height={100} width={100} src={result.image} alt="image"  />
                
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {result.title}
                      <Typography variant="body2" color="text.secondary">
                        {result.description}
                      </Typography>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
