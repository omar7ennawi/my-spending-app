import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Platform,
  View,
  TouchableOpacity,
  DatePickerIOS,
  DatePickerAndroid
} from "react-native";import { TextInput } from 'react-native-gesture-handler';
import Firebase from '../api/config'

Firebase
export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Add Item',
    width: 20
  };

  state = { amount: 0, desc: '', date: new Date() }

  handleAddItem = () => {
    if( this.state.desc !== '' && this.state.amount !== 0){
      // push to add, set to update
      Firebase.database().ref('users/' + 'joel' + '/items').push(
        {
          amount: Number(this.state.amount),
          desc: this.state.desc,
          date: this.state.date.toLocaleDateString()
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
        </ScrollView>
        <TouchableOpacity onPress={this.handleAddItem} style={styles.tabBarStickyBottom}>
            <Text style={{ fontWeight: 'bold' }}>Add </Text>
          </TouchableOpacity>
      </View>
    );
  }
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
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',    
    padding: 10,
  }
}); 