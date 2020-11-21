<template>
  <div id="app" class="container px-4 md:px-20 py-4 mx-auto">
    <h1 class="text-2xl md:text-4xl font-bold mt-4 mb-8">Fake Data Builder for API placeholder</h1>
    <div v-if="!submitted" :key="submitted">
      <form @submit.prevent="">
        <table class="table-fixed w-full">
          <thead>
            <tr>
              <th class="w-3/5 md:w-4/12">Field Name</th>
              <th class="w-2/5 md:w-3/12">Type</th>
              <th class="hidden md:block w-4/12">Example</th>
              <th class="w-1/5 md:w-1/12">Delete</th>
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
              <td class="hidden md:block">
                <p class="mx-4 w-full" v-text="item.example"></p>
              </td>
              <td>
                <div class="text-center object-contain max-w-xs mx-auto px-4" @click="deleteRow(item.id)">
                  <svg class="svg-icon object-contain w-auto h-6 fill-current hover:text-red-500 cursor-pointer" viewBox="0 0 20 20">
                    <path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
                  </svg>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
         <div class="flex flex-col md:flex-row w-full py-4">
            <button @click="addRow" type="" class="flex-1 border-2 rounded p-2 mx-4 my-2 md:my-0 shadow hover:bg-purple-100">
              Add Field
            </button>
            <div class="flex-1 my-2 md:my-0">Rows generated:
              <input type="number" class="rounded bg-gray-200 w-full py-2 mx-4 px-3" v-model.lazy="rowsGenerated">
            </div>
            <div class="flex-1 my-2 md:my-0">Serve data as:
              <select class="rounded bg-gray-200 py-2 mx-4 px-3" v-model.lazy="resultModel">
                <option value="json">JSON</option>
                <option value="xml">XML</option>
              </select>
            </div>
            <button class="flex-1 my-2 md:my-0 border-2 rounded p-2 mx-4 shadow hover:bg-green-100" type="submit" @click="generateData">Generate!</button>
          </div>
      </form>
    </div>
    <div v-else-if="submitted">
      <div class="rounded p-4 my-4 text-left">
        <highlightjs autodetect :code="resultFinal" />
      </div>
      <button class="w-1/2 border-2 rounded p-2 mx-4 shadow hover:bg-yellow-100" v-clipboard="resultFinal" @click="copiedClipboard = true">Copy to clipboard</button>
      <div class="px-8 md:px-96">
        <div v-show="copiedClipboard" class="flex flex-row align-center rounded-lg content-center items-center bg-green-200 my-4 mx-8 p-4" @click="copiedClipboard = false">
        <div class="flex-1 ">
          <svg class="block mx-auto fill-current h-10 w-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>
        </div>
        <div class="flex-3 text-left">
          <h3 class="text-xl font-bold">Copied to clipboard</h3>
          <p class="text-base">Click anywhere on this green notification to dismiss.</p>
        </div>
      </div>
      </div>

      <div class="my-2">Please refresh to create another data. I'm too tired to code this.</div>
    </div>
  </div>
</template>

<script>
import faker from "faker";
import * as uuid from "uuid";
import { generate } from "generate-password";
import dayjs from "dayjs";
import json2xml from "jsontoxml";
import { loremIpsum } from "lorem-ipsum";
export default {
  name: "App",
  components: {

  },
  data() {
    return {
      rowsGenerated: 1,
      resultModel: "json",
      inputData: [
        { id: 0, fieldName: "", type: "", example: "" }
      ],
      typeSelection: [
        { id: 0, value: "faker.address.city", text: "City"},
        { id: 1, value: "faker.address.streetAddress", text: "Street Address"},
        { id: 2, value: "faker.address.county", text: "County"},
        { id: 3, value: "faker.address.country", text: "Country"},
        { id: 4, value: "faker.address.latitude", text: "Latitude"},
        { id: 5, value: "faker.address.longitude", text: "Longitude"},
        { id: 6, value: "faker.address.timeZone", text: "Timezone"},
        { id: 7, value: "faker.commerce.color", text: "Color"},
        { id: 8, value: "faker.commerce.department", text: "Department"},
        { id: 9, value: "faker.commerce.price", text: "Price"},
        { id: 10, value: "faker.commerce.productName", text: "Product Name"},
        { id: 11, value: "faker.commerce.productDescription", text: "Product Description"},
        { id: 12, value: "faker.company.companyName", text: "Company Name"},
        { id: 13, value: "faker.company.catchPhrase", text: "Company Catch Phrase"},
        { id: 14, value: "faker.company.bs", text: "Company BS"},
        { id: 19, value: "faker.finance.amount", text: "Money Amount"},
        { id: 20, value: "faker.finance.currencyCode", text: "Currency Code"},
        { id: 21, value: "faker.finance.currencyName", text: "Currency Name"},
        { id: 22, value: "faker.finance.currencySymbol", text: "Currency Symbol"},
        { id: 23, value: "faker.finance.creditCardNumber", text: "Credit Card Number"},
        { id: 24, value: "faker.finance.creditCardCVV", text: "Credit Card CVV"},
        { id: 25, value: "faker.image.avatar", text: "Avatar Image"},
        { id: 26, value: "faker.image.imageUrl", text: "Any Image"},
        { id: 27, value: "faker.image.abstract", text: "Abstract Image"},
        { id: 28, value: "faker.image.lorempixel", text: "Lorem Pixel Image"},
        { id: 29, value: "faker.image.image", text: "Total Random Image"},
        { id: 30, value: "faker.image.lorempicsum", text: "Lorem Picsum Image"},
        { id: 31, value: "faker.internet.email", text: "Email"},
        { id: 32, value: "faker.internet.userName", text: "User Name"},
        { id: 33, value: "faker.internet.url", text: "Website URL"},
        { id: 34, value: "faker.internet.ip", text: "IPv4 Address"},
        { id: 35, value: "faker.internet.ipv6", text: "IPv6 Address"},
        { id: 36, value: "faker.internet.mac", text: "MAC Address"},
        { id: 37, value: "faker.internet.password", text: "Password"},
        { id: 38, value: "faker.internet.color", text: "HEX Color"},
        { id: 39, value: "faker.lorem.words", text: "Short words"},
        { id: 40, value: "faker.lorem.paragraph", text: "Short Paragraph"},
        { id: 41, value: "faker.lorem.paragraphs", text: "Long Paragraph"},
        { id: 42, value: "faker.lorem.slug", text: "Slug"},
        { id: 43, value: "faker.music.genre", text: "Music Genre"},
        { id: 44, value: "faker.name.firstName", text: "First Name"},
        { id: 45, value: "faker.name.lastName", text: "Last Name"},
        { id: 46, value: "faker.name.findName", text: "Full Name"},
        { id: 47, value: "faker.name.jobTitle", text: "Job Title"},
        { id: 48, value: "faker.name.gender", text: "Gender"},
        { id: 49, value: "faker.name.prefix", text: "Name Prefix"},
        { id: 50, value: "faker.phone.phoneNumber", text: "Phone Number"},
        { id: 51, value: "faker.vehicle.vehicle", text: "Vehicle Name"},
        { id: 52, value: "faker.vehicle.manufacturer", text: "Vehicle Manufacturer"},
        { id: 53, value: "faker.vehicle.model", text: "Vehicle Model"},
        { id: 54, value: "faker.vehicle.type", text: "Vehicle Type"},
        { id: 55, value: "faker.vehicle.fuel", text: "Vehicle Fuel"},
        { id: 56, value: "faker.vehicle.color", text: "Vehicle Color"},
        { id: 57, value: "vanila.1digit", text: "Number (1 digit)"},
        { id: 58, value: "vanilla.2digit", text: "Number (2 digit)"},
        { id: 59, value: "vanilla.3digit", text: "Number (3 digit)"},
        { id: 60, value: "vanilla.4digit", text: "Number (4 digit)"},
        { id: 61, value: "vanilla.5digit", text: "Number (5 digit)"},
        { id: 62, value: "vanilla.10digit", text: "Number (10 digit)"},
        { id: 63, value: "vanilla.boolean", text: "Boolean (true/false)"},
        { id: 64, value: "uuid.v1", text: "UUID v1"},
        { id: 65, value: "uuid.v3", text: "UUID v3"},
        { id: 66, value: "uuid.v4", text: "UUID v4"},
        { id: 67, value: "uuid.v5", text: "UUID v5"},
        { id: 68, value: "generator.secure", text: "Pretty Secure Password"},
        { id: 69, value: "generator.overkill", text: "Overkill Password"},
        { id: 70, value: "faker.date.past", text: "Date (past)"},
        { id: 71, value: "faker.date.future", text: "Date (future)"},
        { id: 72, value: "faker.date.recent", text: "Date (recent)"},
        { id: 73, value: "faker.date.soon", text: "Date (soon)"},
        { id: 74, value: "dayjs.date.past", text: "Date ISO8601 (past)"},
        { id: 75, value: "dayjs.date.future", text: "Date ISO8601 (future)"},
        { id: 76, value: "dayjs.date.recent", text: "Date ISO8601 (recent)"},
        { id: 77, value: "dayjs.date.soon", text: "Date ISO8601 (soon)"},
        { id: 78, value: "lorem.3sentence", text: "Lorem ipsum 3 sentences"},
        { id: 79, value: "lorem.1paragraph", text: "Lorem ipsum 1 paragraph"},
        { id: 80, value: "lorem.3paragraph", text: "Lorem ipsum 3 paragraph"},
        { id: 81, value: "lorem.5paragraph", text: "Lorem ipsum 5 paragraph"},
        { id: 82, value: "lorem.5html", text: "Lorem ipsum 5 paragraph (HTML)"},
      ],
      submitted: false,
      resultFinal: "",
      copiedClipboard: false
    };
  },
  created() {
  },
  methods: {
    /**
     * Function related to generating data
     */
    generateData() {

      const submittedData = this.inputData; // {} Object with existing values
      const submittedCount = Object.keys(submittedData).length; // Number of fields
      const result = {}; // Empty object, will be filled with objects later
      let resultArray;
      let resultString;

      for (let i = 0; i < this.rowsGenerated; i++) {
        resultString = "";
        resultArray = []; // always reset the resultArray, so new data can populate them

        for (let j = 0; j < submittedCount; j++) {

          const escapedFieldName = this.escapeFilter(submittedData[j].fieldName);

          if (submittedData[j].type.startsWith("faker.")) {

            const dataType = submittedData[j].type.replace("faker.", "");
            resultArray.push(`"${escapedFieldName}": "${this.escapeFilter(faker.fake("{{"+dataType+"}}"))}"`);

          } else if (submittedData[j].type.startsWith("vanilla.")) {

            const dataType = submittedData[j].type.replace("vanilla.", "");
            if (dataType === "1digit") {
              resultArray.push(`"${escapedFieldName}": "${this.getRandomInt(0,9)}"`);
            } else if (dataType === "2digit") {
              resultArray.push(`"${escapedFieldName}": "${this.getRandomInt(10,99)}"`);
            } else if (dataType === "3digit") {
              resultArray.push(`"${escapedFieldName}": "${this.getRandomInt(100,999)}"`);
            } else if (dataType === "4digit") {
              resultArray.push(`"${escapedFieldName}": "${this.getRandomInt(1000,9999)}"`);
            } else if (dataType === "5digit") {
              resultArray.push(`"${escapedFieldName}": "${this.getRandomInt(10000,99999)}"`);
            } else if (dataType === "10digit") {
              resultArray.push(`"${escapedFieldName}": "${this.getRandomInt(1000000000,9999999999)}"`);
            } else if (dataType === "boolean") {
              const boolean = (this.getRandomInt(0,1) === 1) ? "true" : "false";
              resultArray.push(`"${escapedFieldName}": "${boolean}"`);
            }

          } else if (submittedData[j].type.startsWith("generator.")) {

            const dataType = submittedData[j].type.replace("generator.", "");
            if (dataType === "secure") {
              resultArray.push(`"${escapedFieldName}": "${generate({length: 12, excludeSimilarCharacters: true})}"`);
            } else if (dataType === "overkill") {
              resultArray.push(`"${escapedFieldName}": "${this.escapeFilter(generate({length: 30, strict: true, symbols: true, numbers: true}))}"`);
            }


          } else if (submittedData[j].type.startsWith("uuid.")) {

            const dataType = submittedData[j].type.replace("uuid.", "");
            if (dataType === "v1") {
              resultArray.push(`"${escapedFieldName}": "${uuid.v1()}"`);
            } else if (dataType === "v3") {
              resultArray.push(`"${escapedFieldName}": "${uuid.v3("Fake UUID", "d21cf6b8-db42-430b-a829-520d34f9f06f")}"`);
            } else if (dataType === "v4") {
              resultArray.push(`"${escapedFieldName}": "${uuid.v4()}"`);
            } else if (dataType === "v5") {
              resultArray.push(`"${escapedFieldName}": "${uuid.v5("Fake UUID", "d21cf6b8-db42-430b-a829-520d34f9f06f")}"`);
            }

          } else if (submittedData[j].type.startsWith("dayjs.")) {

            const dataType = submittedData[j].type.replace("dayjs.", "");
            resultArray.push(`"${escapedFieldName}": "${dayjs(faker.fake("{{"+dataType+"}}")).format()}"`);

          } else if (submittedData[j].type.startsWith("lorem.")) {

            const dataType = submittedData[j].type.replace("lorem.", "");
            if (dataType === "3sentence") {
              resultArray.push(`"${escapedFieldName}": "${this.escapeFilter(loremIpsum({
                count: 3,
                units: "sentences",
                format: "plain"
              }))}"`);
            } else if (dataType === "1paragraph") {
              resultArray.push(`"${escapedFieldName}": "${this.escapeFilter(loremIpsum({
                count: 1,
                units: "paragraphs",
                format: "plain"
              }))}"`);
            } else if (dataType === "3paragraph") {
              resultArray.push(`"${escapedFieldName}": "${this.escapeFilter(loremIpsum({
                count: 3,
                units: "paragraphs",
                format: "plain"
              }))}"`);
            } else if (dataType === "5paragraph") {
              resultArray.push(`"${escapedFieldName}": "${this.escapeFilter(loremIpsum({
                count: 5,
                units: "paragraphs",
                format: "plain"
              }))}"`);
            } else if (dataType === "5html") {
              resultArray.push(`"${escapedFieldName}": "${this.escapeFilter(loremIpsum({
                count: 5,
                units: "paragraphs",
                format: "html"
              }))}"`);
            }
          }
        }
        resultString = "{\"" + Number(i) + "\":{" + String(resultArray) + "}}";
        Object.assign(result, JSON.parse(resultString));
      }

      if (this.resultModel === "json") {
        this.resultFinal = JSON.stringify(result, null, 2);
      } else if (this.resultModel === "xml") {
        this.resultFinal = json2xml(result, { indent: "  ", xmlHeader: true, prettyPrint: true, removeIllegalNameCharacters: true});
      }
      this.submitted = true;
    },

    /**
     * Functions related to the form
     */
    addRow() {
      const newID = this.inputData[0] ? this.inputData.slice(-1)[0].id + 1 : 0;
      this.inputData.push({id: newID, fieldName: "", type: "", example: ""});
    },
    deleteRow(value) {
      this.inputData.splice(value, 1);
    },
    changeType(value) {
      const type = this.inputData[value].type;
      if (type.startsWith("faker.")) {
        const dataType = type.replace("faker.", "");
        this.inputData[value].example = faker.fake(`{{${dataType}}}`);

      } else if (type.startsWith("vanilla.")) {
        const dataType = type.replace("vanilla.", "");
        if (dataType === "1digit") {
          this.inputData[value].example = this.getRandomInt(0,9);
        } else if (dataType === "2digit") {
          this.inputData[value].example = this.getRandomInt(10,99);
        } else if (dataType === "3digit") {
          this.inputData[value].example = this.getRandomInt(100,999);
        } else if (dataType === "4digit") {
          this.inputData[value].example = this.getRandomInt(1000,9999);
        } else if (dataType === "5digit") {
          this.inputData[value].example = this.getRandomInt(10000,99999);
        } else if (dataType === "10digit") {
          this.inputData[value].example = this.getRandomInt(1000000000,9999999999);
        } else if (dataType === "boolean") {
          const boolean = (this.getRandomInt(0,1) === 1) ? "true" : "false";
          this.inputData[value].example = boolean;
        }

      } else if (type.startsWith("uuid.")) {
        const dataType = type.replace("uuid.", "");
        if (dataType === "v1") {
         this.inputData[value].example = uuid.v1();
        } else if (dataType === "v3") {
          this.inputData[value].example = uuid.v3();
        } else if (dataType === "v4") {
         this.inputData[value].example = uuid.v4();
        } else if (dataType === "v5") {
          this.inputData[value].example = uuid.v5("Fake UUID", "d21cf6b8-db42-430b-a829-520d34f9f06f");
        }
      } else if (type.startsWith("generator.")) {
        const dataType = type.replace("generator.", "");
        if (dataType === "secure") {
          this.inputData[value].example = generate({length: 12, excludeSimilarCharacters: true});
        } else if (dataType === "overkill") {
          this.inputData[value].example = generate({length: 30, strict: true, symbols: true, numbers: true});
        }
      } else if (type.startsWith("dayjs.")) {
          const dataType = type.replace("dayjs.", "");
          this.inputData[value].example = dayjs(faker.fake("{{"+dataType+"}}")).format();
      } else if (type.startsWith("lorem.")) {
          const dataType = type.replace("dayjs.", "");
        if (dataType === "5html") {
          this.inputData[value].example = this.escapeFilter(loremIpsum({
                count: 1,
                units: "sentence",
                format: "html"
              }));
        } else {
          this.inputData[value].example = this.escapeFilter(loremIpsum({
                count: 1,
                units: "sentence",
                format: "plain"
              }));
        }
      }
    },

    /**
     * Function to make the JSON generation works
     */
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    escapeFilter(words) {
      words = words.replace(/\\/g, "\\\\"); // escape backslashes
      words = words.replace(/"/g, "\\\""); // escape double quote
      words = words.replace(/(\r\n|\n|\r)/gm, ""); // escape line breaks
      return words;
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.flex-3 {
  flex: 3 3 0%;
}
</style>
