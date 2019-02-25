import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Platform,
  Button,
  Image,
  View,
  TouchableOpacity,
  DatePickerIOS,
  DatePickerAndroid
} from "react-native";import { TextInput } from 'react-native-gesture-handler';
import Firebase from '../api/config'
import { ImagePicker, Permissions } from "expo";
import uuid from "uuid";


export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Add Item',
    width: 20
  };

  state = { amount: 0, desc: '', date: new Date(), image: null }

  handleAddItem = () => {
    if( this.state.desc !== '' && this.state.amount !== 0){
      // push to add, set to update
      Firebase.database().ref('users/' + 'joel' + '/items').push(
        {
          amount: Number(this.state.amount),
          desc: this.state.desc,
          date: this.state.date.toLocaleDateString(),
          picture: this.state.image
        }
      )
      // to switch screens, can add a comma followed by an object to pass back but needs to have a listener in the other screen to capture the data
      // shouldComponentUpdate(newProps, newState) {
      //   const valueFromOtherScreen = newProps.navigation.getParam("test", false);
      //   if (valueFromOtherScreen) {
      //     alert(valueFromOtherScreen)

      //     const tempItems = this.state.items
      //     tempItems.push([valueFromOtherScreen])

      //     this.setState({items: tempItems})
      //     return true
      //   }
      //   return false
      // }
      this.props.navigation.navigate("Home")
    }
    else{
      alert("Please enter a valid amound and description")
    }
  }


  render() {
    const { image } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView keyboardDismissMode={'on-drag'}>
          <View style={styles.row}>
            <Text style={{ fontSize: 18 }}>Price</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text>RM </Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(input) => this.setState({ amount: input })}
                value={this.state.text}
                keyboardType='numeric'
              />
            </View>
          </View>
          <View style={styles.row}>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <TextInput
                 style={[styles.textInput, {flex: 1}]}
                 onChangeText={(desc) => this.setState({ desc })}
                 value={this.state.text}
                 keyboardType='keyboard'
                 placeholder="Description"
               />
             </View>
           </View>
           <View style={styles.row}>
             <View style={{ flex: 1 }}>
               {
                 Platform.OS === 'ios' ?
                   <DatePickerIOS
                     date={this.state.date}
                     onDateChange={(date) => this.setState({ date })}
                   /> :
                   <TouchableOpacity
                     onPress={async () => {
                        const {year, month, day} = await DatePickerAndroid.open({
                          date: new Date()
                        });
                        this.setState({date: new Date(year, month, day)})
                     }}>
                     <Text>{this.state.date.toString()}</Text>
                   </TouchableOpacity>
               }
             </View>
           </View>
           <Button
            title="Pick an image from camera roll"
            onPress={async () => {
              // Ask for permission
              const { status } = await Permissions.askAsync(
                Permissions.CAMERA_ROLL
              );
              if (status === "granted") {
                // Do camera stuff
                let result = await ImagePicker.launchImageLibraryAsync({
                  allowsEditing: true,
                  aspect: [4, 3]
                });

                console.log(result);

                if (!result.cancelled) {
                  this.setState({ image: result.uri });
                  const imageURL = await uploadImageAsync(result.uri)
                  this.setState({image: imageURL})
                }
              } else {
                // Permission denied
                throw new Error("Camera permission not granted");
              }
              
            }}
          />
          {image && (
            <Text>{image}</Text>
          )}
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          )}
        </ScrollView>
        <TouchableOpacity onPress={this.handleAddItem} style={styles.tabBarStickyBottom}>
            <Text style={{ fontWeight: 'bold' }}>Add </Text>
          </TouchableOpacity>
      </View>
    );
  }
}

async function uploadImageAsync(uri) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const ref = Firebase
    .storage()
    .ref()
    .child(uuid.v4());
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();
  alert(snapshot.ref.getDownloadURL())
  return await snapshot.ref.getDownloadURL();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 30,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  textInput: {
    width: 80,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    padding: 10
  },
  tabBarStickyBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#f66666',
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',    
    padding: 10,
  }
}); 