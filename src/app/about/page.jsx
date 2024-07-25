"use client";
import React, { useEffect } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import { FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Sample team member data
const members = [
  {
    id: 1,
    name: "John Doe",
    role: "Editor-in-Chief",
    image: "https://picsum.photos/200?random=1",
    bio: "John Doe is the Editor-in-Chief with over 10 years of experience in journalism. He oversees all content and ensures it meets the highest standards.",
    socialLinks: {
      twitter: "https://twitter.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe"
    },
    email: "john.doe@example.com"
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Senior Reporter",
    image: "https://picsum.photos/200?random=2",
    bio: "Jane Smith is a Senior Reporter specializing in political news. Her investigative work has won several awards.",
    socialLinks: {
      twitter: "https://twitter.com/janesmith",
      linkedin: "https://linkedin.com/in/janesmith"
    },
    email: "jane.smith@example.com"
  },
  {
    id: 3,
    name: "Emily Johnson",
    role: "Content Strategist",
    image: "https://picsum.photos/200?random=3",
    bio: "Emily Johnson is the Content Strategist responsible for planning and optimizing content strategy to engage our audience.",
    socialLinks: {
      twitter: "https://twitter.com/emilyjohnson",
      linkedin: "https://linkedin.com/in/emilyjohnson"
    },
    email: "emily.johnson@example.com"
  },
  {
    id: 4,
    name: "Michael Brown",
    role: "Lead Designer",
    image: "https://picsum.photos/200?random=4",
    bio: "Michael Brown is the Lead Designer with a passion for creating engaging and intuitive user experiences. He ensures our visual content aligns with our brand identity.",
    socialLinks: {
      twitter: "https://twitter.com/michaelbrown",
      linkedin: "https://linkedin.com/in/michaelbrown"
    },
    email: "michael.brown@example.com"
  },
  {
    id: 5,
    name: "Sarah Lee",
    role: "Senior Developer",
    image: "https://picsum.photos/200?random=5",
    bio: "Sarah Lee is a Senior Developer who specializes in full-stack development. She brings innovative solutions to complex technical problems.",
    socialLinks: {
      twitter: "https://twitter.com/sarahlee",
      linkedin: "https://linkedin.com/in/sarahlee"
    },
    email: "sarah.lee@example.com"
  },
  {
    id: 6,
    name: "David Wilson",
    role: "Marketing Specialist",
    image: "https://picsum.photos/200?random=6",
    bio: "David Wilson is our Marketing Specialist, focusing on strategies to enhance our outreach and engagement. His data-driven approach helps drive growth.",
    socialLinks: {
      twitter: "https://twitter.com/davidwilson",
      linkedin: "https://linkedin.com/in/davidwilson"
    },
    email: "david.wilson@example.com"
  },
  {
    id: 7,
    name: "Laura Martinez",
    role: "Community Manager",
    image: "https://picsum.photos/200?random=7",
    bio: "Laura Martinez manages our community interactions and fosters engagement. She ensures a positive experience for our readers and handles inquiries efficiently.",
    socialLinks: {
      twitter: "https://twitter.com/lauramartinez",
      linkedin: "https://linkedin.com/in/lauramartinez"
    },
    email: "laura.martinez@example.com"
  },
  {
    id: 8,
    name: "Chris Green",
    role: "Technical Support",
    image: "https://picsum.photos/200?random=8",
    bio: "Chris Green provides technical support and troubleshooting assistance. He ensures that any technical issues are resolved promptly to maintain smooth operations.",
    socialLinks: {
      twitter: "https://twitter.com/chrisgreen",
      linkedin: "https://linkedin.com/in/chrisgreen"
    },
    email: "chris.green@example.com"
  },
  {
    id: 9,
    name: "Olivia Taylor",
    role: "Copy Editor",
    image: "https://picsum.photos/200?random=9",
    bio: "Olivia Taylor is a meticulous Copy Editor who ensures that all content is polished, accurate, and free of errors. Her keen eye for detail is vital for our publication.",
    socialLinks: {
      twitter: "https://twitter.com/oliviataylor",
      linkedin: "https://linkedin.com/in/oliviataylor"
    },
    email: "olivia.taylor@example.com"
  },
  {
    id: 10,
    name: "Ethan Harris",
    role: "SEO Specialist",
    image: "https://picsum.photos/200?random=10",
    bio: "Ethan Harris is our SEO Specialist, working on strategies to improve our visibility in search engines. His expertise helps attract more traffic to our site.",
    socialLinks: {
      twitter: "https://twitter.com/ethanharris",
      linkedin: "https://linkedin.com/in/ethanharris"
    },
    email: "ethan.harris@example.com"
  }
];

const MemberCard = ({ member }) => {
  useEffect(() => {
    gsap.fromTo(
      `.card-${member.id}`,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: `.card-${member.id}`,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, [member.id]);

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        className={`card-${member.id}`}
        sx={{
          backgroundColor: 'var(--softBg)',
          color: 'var(--textColor)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          borderRadius: '8px',
          boxShadow: 3,
          overflow: 'hidden',
        }}
      >
        <CardMedia
          component="img"
          sx={{
            height: 200,
            width: 200,
            borderRadius: '50%',
            objectFit: 'cover',
            margin: 'auto',
            mt: 2
          }}
          image={member.image}
          alt={member.name}
        />
        <CardContent
          sx={{
            flex: 1, // This makes the CardContent flexible to fill remaining space
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <Typography variant="h6" component="h3" sx={{ color: 'var(--textColor)' }}>
              {member.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'var(--softTextColor)' }}>
              {member.role}
            </Typography>
            <Typography variant="body2" paragraph sx={{ color: 'var(--textColor)' }}>
              {member.bio}
            </Typography>
          </div>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            mb: 2,
            mt: 'auto', // Pushes the social links to the bottom of the CardContent
          }}>
            {member.socialLinks.twitter && (
              <IconButton
                component="a"
                href={member.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                aria-label="Twitter"
              >
                <FaTwitter />
              </IconButton>
            )}
            {member.socialLinks.linkedin && (
              <IconButton
                component="a"
                href={member.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </IconButton>
            )}
            {member.email && (
              <IconButton
                component="a"
                href={`mailto:${member.email}`}
                color="primary"
                aria-label="Email"
              >
                <FaEnvelope />
              </IconButton>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};


const AboutPage = () => {
  useEffect(() => {
    gsap.fromTo(
      '.about-header',
      { opacity: 0, y: -50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.2,
      }
    );
    gsap.fromTo(
      '.team-heading',
      { opacity: 0, y: -50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.4,
      }
    );
    gsap.fromTo(
      '.team-section',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.6,
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.team-section',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, []);

  return (
    <Box sx={{
      backgroundColor: 'var(--bg)',
      color: 'var(--textColor)',
      padding: 4,
      maxWidth: '1200px',
      margin: 'auto'
    }}>
      <Box className="about-header" sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          About LLIS Student News
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 2, textAlign: 'center', lineHeight: 1.6 }}>
          Welcome to LLIS Student News, where we bring you the latest updates and stories from our community. Our dedicated team works tirelessly to provide high-quality journalism and engaging content.
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 4, textAlign: 'center', lineHeight: 1.6 }}>
          In this section, you’ll get to know our talented team members who make everything possible. Discover the faces behind our stories and learn more about their roles and expertise.
        </Typography>
      </Box>

      <Box className="team-section">
        <Typography className="team-heading" variant="h5" component="h2" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          Meet the Team
        </Typography>
        <Grid container spacing={4}>
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AboutPage;
