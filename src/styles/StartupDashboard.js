import styled from '@emotion/styled';
import { Box, Typography, Button, List } from '@mui/material';

const drawerWidth = 270;

export const Container = styled(Box)`
  display: flex;
  flex-grow: 1;
  padding: 50px 35px 0 ${drawerWidth}px;
  overflow-x: hidden;
  padding-bottom: 50px;
  background: #f5f5f5;
`;

export const HeaderBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const TopInfoBox = styled(Box)`
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0;
  background: white;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
  padding: 10px;
`;

export const TopInfoIcon = styled(Box)`
  position: absolute;
  top: 18px;
  right: 20px;
  width: 40px; 
  height: 40px;
  border-radius: 50%;
  background-color: #336FB0; 
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4); 
  cursor: pointer;
  z-index: 1;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    box-shadow: 0 12px 24px rgba(0, 116, 144, 0.8);
    transform: scale(1.05); 
  }
`;

export const TopInfoText = styled(Typography)`
  color: #333333;
  text-align: center;
  font-size: 15px;
`;

export const TopInfoTitle = styled(Typography)`
  color: #232023;
  font-weight: bold;
  text-align: center;
  font-size: 16px;
`;

export const CreateButton = styled(Button)`
  width: 180px; 
  background-color: #336FB0;
  color: #f2f2f2;
  border-radius: 5px;
  transition: background-color 0.3s, box-shadow 0.3s; 
  &:hover {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
    background-color: #336FB0;
  }
`;

export const RecentActivityBox = styled(Box)`
  background-color: white;
  height: 540px;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border: 1px solid #e0e0e0;
`;

export const GraphTitle = styled(Typography)`
  font-weight: bold;
  padding: 15px 15px 0 30px;
  color: #232023;
  font-size: 18px;
`;

export const RecentActivityTitle = styled(Typography)`
  font-weight: bold;
  padding: 15px;
  color: #232023;
  font-size: 18px;
  display: flex;
  align-items: center; 
`;

export const RecentActivityList = styled(List)`
  color: #333333;
  padding-left: 1px;
  overflow-y: auto;
`;