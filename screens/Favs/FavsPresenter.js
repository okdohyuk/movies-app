import React, { useState } from 'react';
import { PanResponder, Dimensions, Animated } from 'react-native';
import styled from 'styled-components/native';
import { apiImage } from '../../api';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
  background-color: black;
  align-items: center;
`;

const Poster = styled.Image`
  border-radius: 20px;
  width: 100%;
  height: 100%;
`;

const styles = {
  top: 80,
  height: HEIGHT / 1.5,
  width: '90%',
  position: 'absolute',
};

export default ({ results }) => {
  const [topIndex, setTopIndex] = useState(0);
  const position = new Animated.ValueXY();
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, { dx, dy }) => {
      position.setValue({ x: dx, y: dy });
    },
    onPanResponderRelease: () => {
      Animated.spring(position, {
        toValue: {
          x: 0,
          y: 0,
        },
      }).start();
    },
  });
  const roationValues = position.x.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: ['-5deg', '0deg', '5deg'],
    extrapolate: 'clamp',
  });
  setInterval(() => {
    console.log(roationValues);
  }, 500);
  return (
    <Container>
      {results.map((results, index) => {
        if (index === topIndex) {
          return (
            <Animated.View
              style={{
                ...styles,
                zIndex: 1,
                transform: [
                  { rotate: roationValues },
                  ...position.getTranslateTransform(),
                ],
              }}
              key={results.id}
              {...panResponder.panHandlers}
            >
              <Poster source={{ uri: apiImage(results.poster_path) }} />
            </Animated.View>
          );
        }
        return (
          <Animated.View
            style={{
              ...styles,
              zIndex: -index,
            }}
            key={results.id}
            {...panResponder.panHandlers}
          >
            <Poster source={{ uri: apiImage(results.poster_path) }} />
          </Animated.View>
        );
      })}
    </Container>
  );
};