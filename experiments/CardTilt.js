import React, { useRef } from 'react';
import { Text, SafeAreaView, StyleSheet, View, PanResponder, Image, Dimensions } from 'react-native';
// import { Gyroscope } from 'expo-sensors';
import Animated, {
    withTiming,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    Easing
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform } from 'react-native-web';

const CardTilt = () => {
    const gyroValue = useSharedValue({ x: 0, y: 0 });
    const prev = useSharedValue({ x: 0, y: 0 });
    const { width, height } = Dimensions.get('window');

    function convertAbsToRelative({ x, y }) {

        return {
            x: x - (width / 2),
            y: y - (height / 2)
        }
    }
    const panResponder = useRef(
        PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) =>
                true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
                true,

            onPanResponderGrant: (evt, gestureState) => {
                // The gesture has started. Show visual feedback so the user knows
                // what is happening!
                // gestureState.d{x,y} will be set to zero now
                gyroValue.value = convertAbsToRelative({
                    x: gestureState.x0,
                    y: gestureState.y0
                })
            },
            onPanResponderMove: (evt, gestureState) => {
                // The most recent move distance is gestureState.move{X,Y}
                // The accumulated gesture distance since becoming responder is
                // console.log("move ", gestureState)
                gyroValue.value = convertAbsToRelative({
                    x: gestureState.moveX,
                    y: gestureState.moveY
                })

            },
            onPanResponderTerminationRequest: (evt, gestureState) =>
                true,
            onPanResponderRelease: (evt, gestureState) => {
                // The user has released all touches while this view is the
                // responder. This typically means a gesture has succeeded

                gyroValue.value = { x: 0, y: 0 };
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // Another component has become the responder, so this gesture
                // should be cancelled
                gyroValue.value = { x: 0, y: 0 };

            },
        })
    ).current;

    const derivedTranslations = useDerivedValue(() => {
        'worklet';

        const MAX_X = width / 2;
        const MAX_Y = height / 2;

        let newX = gyroValue.value.x;
        let newY = gyroValue.value.y;

        // Can be more cleaner
        if (Math.abs(newX) >= MAX_X) {
            newX = prev.value.x;
        }
        if (Math.abs(newY) >= MAX_Y) {
            newY = prev.value.y;
        }

        prev.value = {
            x: newX,
            y: newY,
        };
        return {
            x: newX,
            y: newY,
        };
    }, [gyroValue.value]);

    const animatedStyles = {
        motion: useAnimatedStyle(() => {

            return {
                transform: [
                    {
                        perspective: 1000
                    },
                    {
                        rotateY:
                            derivedTranslations.value.x / (width / 2) * 13 + "deg",
                    },
                    {
                        rotateX: -derivedTranslations.value.y / (height / 2) * 15 + "deg",
                    },
                ],
            };
        }),
    };

    return (
        <SafeAreaView>
            <View style={styles.cont}>
                <Animated.View
                    style={[styles.background,
                        //  animatedStyles.motion
                    ]}

                >
                    <LinearGradient
                        // Button Linear Gradient
                        colors={['#00b3ff', '#ffa939']}
                        style={styles.fill}
                        end={{ x: 1, y: 0.5 }}
                    >
                        <Animated.View
                            style={[styles.card, animatedStyles.motion]}
                            {...panResponder.panHandlers}
                        >
                            {/* <Text style={{ color: "#FFF" }}>wow.</Text> */}
                            <View />
                            <View style={{ backgroundColor: "#222", borderRadius: 6, width: 50, height: 40 }} />
                            <View style={{ backgroundColor: "#222", borderRadius: 6, width: "80%", height: 25 }} />

                        </Animated.View>
                    </LinearGradient>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    cont: {
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        backgroundColor: '#111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    background: {
        // position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        // zIndex: 10,
        backgroundColor: "#0090ff",
        // aspectRatio: 1,
        // bottom: '-5%',
        width: "80%",
        height: 200,
        borderRadius: 12,
    },
    card: {
        width: "99.5%",
        height: "99.5%",
        backgroundColor: "#111",
        borderRadius: 12,
        // alignItems: 'center',
        justifyContent: 'space-between',
        padding: 30
    },
    fill: {
        width: "100%",
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12
    }
});

export default CardTilt;