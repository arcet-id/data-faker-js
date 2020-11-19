<template>
  <div id="app" class="container px-20 py-4 mx-auto">
    <h1 class="text-4xl font-bold">Data faker - Customize all you want</h1>
    <div v-if="!submitted" :key="submitted">
      <form @submit.prevent="">
        <table class="table-fixed w-full">
          <thead>
            <tr>
              <th class="w-4/12">Field Name</th>
              <th class="w-3/12">Type</th>
              <th class="w-4/12">Example</th>
              <th class="w-1/12">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in inputData" :key="item.id" class="py-2 my-2">
              <td>
                <input type="text" class="rounded bg-gray-200 w-full py-2 mx-4 px-3" v-model.lazy="item.fieldName">
              </td>
              <td>
                <select class="rounded bg-gray-200 w-full py-2 mx-4 px-3" v-model.lazy="item.type" @change="changeType(item.id)">
                  <option v-for="type in typeSelection" :key="type.id" :value="type.value">{{ type.text }}</option>
                </select>
              </td>
              <td>
                <p class="mx-4 w-full" v-text="item.example"></p>
              </td>
              <td>
                <div class="text-center object-contain max-w-xs" @click="deleteRow(item.id)">
                  <svg class="svg-icon object-contain w-auto h-6 fill-current hover:text-red-500 cursor-pointer" viewBox="0 0 20 20">
                    <path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
                  </svg>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
         <div class="flex flex-row w-full py-4">
            <button @click="addRow" type="" class="flex-1 border-2 rounded p-2 mx-4 shadow hover:bg-purple-100">
              Add Field
            </button>
            <div class="flex-1">Rows generated:
              <input type="number" class="rounded bg-gray-200 w-full py-2 mx-4 px-3" v-model.lazy="rowsGenerated">
            </div>
            <div class="flex-1">Serve data as:
              <select class="rounded bg-gray-200 py-2 mx-4 px-3" v-model.lazy="resultModel">
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="xml">XML</option>
              </select>
            </div>
            <button class="flex-1 border-2 rounded p-2 mx-4 shadow hover:bg-green-100" type="submit" @click="generateData">Generate!</button>
          </div>
      </form>
    </div>
    <div v-else-if="submitted">
      <div class="rounded bg-black text-white p-4 my-4 text-left">
        <highlightjs :language="resultModel" :code="resultFinal" />
      </div>
      <button class="w-1/2 border-2 rounded p-2 mx-4 shadow hover:bg-yellow-100" v-clipboard="resultFinal">Copy to clipboard</button>
      <div>Please refresh to create another data. I'm too tired to code this.</div>
    </div>
  </div>
</template>

<script>
import faker from 'faker'
import { json2csv } from 'json-2-csv'
import json2xml from 'jsontoxml'
export default {
  name: 'App',
  components: {
    
  },
  data() {
    return {
      rowsGenerated: 1,
      resultModel: 'json',
      inputData: [
        { id: 0, fieldName: '', type: '', example: '' }
      ],
      typeSelection: [
        { id: 0, value: 'address.city', text: 'City'},
        { id: 1, value: 'address.streetAddress', text: 'Street Address'},
        { id: 2, value: 'address.county', text: 'County'},
        { id: 3, value: 'address.country', text: 'Country'},
        { id: 4, value: 'address.latitude', text: 'Latitude'},
        { id: 5, value: 'address.longitude', text: 'Longitude'},
        { id: 6, value: 'address.timeZone', text: 'Timezone'},
        { id: 7, value: 'commerce.color', text: 'Color'},
        { id: 8, value: 'commerce.department', text: 'Department'},
        { id: 9, value: 'commerce.price', text: 'Price'},
        { id: 10, value: 'commerce.productName', text: 'Product Name'},
        { id: 11, value: 'commerce.productDescription', text: 'Product Description'},
        { id: 12, value: 'company.companyName', text: 'Company Name'},
        { id: 13, value: 'company.catchPhrase', text: 'Company Catch Phrase'},
        { id: 14, value: 'company.bs', text: 'Company BS'},
        { id: 15, value: 'date.past', text: 'Date (past)'},
        { id: 16, value: 'date.future', text: 'Date (future)'},
        { id: 17, value: 'date.recent', text: 'Date (recent)'},
        { id: 18, value: 'date.soon', text: 'Date (soon)'},
        { id: 19, value: 'finance.amount', text: 'Money Amount'},
        { id: 20, value: 'finance.currencyCode', text: 'Currency Code'},
        { id: 21, value: 'finance.currencyName', text: 'Currency Name'},
        { id: 22, value: 'finance.currencySymbol', text: 'Currency Symbol'},
        { id: 23, value: 'finance.creditCardNumber', text: 'Credit Card Number'},
        { id: 24, value: 'finance.creditCardCVV', text: 'Credit Card CVV'},
        { id: 25, value: 'image.avatar', text: 'Avatar Image'},
        { id: 26, value: 'image.imageUrl', text: 'Any Image'},
        { id: 27, value: 'image.abstract', text: 'Abstract Image'},
        { id: 28, value: 'image.lorempixel', text: 'Lorem Pixel Image'},
        { id: 29, value: 'image.unsplash', text: 'Unsplash Image'},
        { id: 30, value: 'image.lorempicsum', text: 'Lorem Picsum Image'},
        { id: 31, value: 'internet.email', text: 'Email'},
        { id: 32, value: 'internet.userName', text: 'User Name'},
        { id: 33, value: 'internet.url', text: 'Website URL'},
        { id: 34, value: 'internet.ip', text: 'IPv4 Address'},
        { id: 35, value: 'internet.ipv6', text: 'IPv6 Address'},
        { id: 36, value: 'internet.mac', text: 'MAC Address'},
        { id: 37, value: 'internet.password', text: 'Password'},
        { id: 38, value: 'internet.color', text: 'HEX Color'},
        { id: 39, value: 'lorem.words', text: 'Short words'},
        { id: 40, value: 'lorem.paragraph', text: 'Short Paragraph'},
        { id: 41, value: 'lorem.paragraphs', text: 'Long Paragraph'},
        { id: 42, value: 'lorem.slug', text: 'Slug'},
        { id: 43, value: 'music.genre', text: 'Music Genre'},
        { id: 44, value: 'name.firstName', text: 'First Name'},
        { id: 45, value: 'name.lastName', text: 'Last Name'},
        { id: 46, value: 'name.findName', text: 'Full Name'},
        { id: 47, value: 'name.jobTitle', text: 'Job Title'},
        { id: 48, value: 'name.gender', text: 'Gender'},
        { id: 49, value: 'name.prefix', text: 'Name Prefix'},
        { id: 50, value: 'phone.phoneNumber', text: 'Phone Number'},
        { id: 51, value: 'vehicle.vehicle', text: 'Vehicle Name'},
        { id: 52, value: 'vehicle.manufacturer', text: 'Vehicle Manufacturer'},
        { id: 53, value: 'vehicle.model', text: 'Vehicle Model'},
        { id: 54, value: 'vehicle.type', text: 'Vehicle Type'},
        { id: 55, value: 'vehicle.fuel', text: 'Vehicle Fuel'},
        { id: 56, value: 'vehicle.color', text: 'Vehicle Color'},
      ],
      submitted: false,
      resultFinal: ''
    }
  },
  created() {
  },
  methods: {
    generateData() {
      const submittedData = this.inputData // {} Object
      const submittedCount = Object.keys(submittedData).length // 3
      let result = [] // Empty array, will be filled with objects later
      let resultArray
      let resultString
      for (let i = 0; i < this.rowsGenerated; i++) {
        resultString = ''
        resultArray = [] // always reset the resultObject
        for (let j = 0; j < submittedCount; j++) {
          resultArray.push(`"${submittedData[j].fieldName}": "${faker.fake('{{'+submittedData[j].type+'}}')}"`)
        }
        resultString = '{' + String(resultArray) + '}'
        result.push(JSON.parse(resultString))
      }

      if (this.resultModel === 'csv') {
        this.resultFinal = json2csv(result, (err, res) => {
          if (err) {
            console.error(err)
          } else {
            return res
          }
        })
      } else if (this.resultModel === 'json') {
        this.resultFinal = JSON.stringify(result, null, 2)
      } else if (this.resultModel === 'xml') {
        this.resultFinal = json2xml(result)
      }
      this.submitted = true
    },
    addRow() {
      const newID = this.inputData[0] ? this.inputData.slice(-1)[0].id + 1 : 0
      this.inputData.push({id: newID, fieldName: '', type: '', example: ''})
    },
    deleteRow(value) {
      this.inputData.splice(value, 1);
    },
    changeType(value) {
      const type = this.inputData[value].type
      this.inputData[value].example = faker.fake(`{{${type}}}`)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
