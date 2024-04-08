import { useState } from 'react';
const StoreLocations = () => {
  const storeData = [
    {
      name: 'TRC Ocean Plaza',
      address: 'Antonovycha, 176, Ground Floor, Left from Eldorado, Across from Butlers',
      workingHours: 'Daily 10:00 - 22:00',
      mapLink: 'Link to map',
      city: 'Kiyv'
    },
    {
      name: 'TRC River Mall',
      address: 'Dniprovska Naberezhna, 12, Second Floor',
      workingHours: 'Daily 10:00 - 22:00',
      mapLink: 'Link to map',
      city: 'Kiyv'
    },
    {
      name: 'TRC DREAM yellow',
      address: 'Prospekt Obolonsky, 1-B, First Floor, Atrium "Greece 5B"',
      workingHours: 'Daily 10:00 - 22:00',
      mapLink: 'Link to map',
      city: 'Kiyv'
    },
    {
      name: 'TRC Lavina Mall',
      address: 'Berkovetska, 6-D, First Floor, First Quarter from the Entrance near Epicentr',
      workingHours: 'Daily 10:00 - 22:00',
      mapLink: 'Link to map',
      city: 'Kiyv'
    },
    {
      name: 'TRC Respublika Park',
      address: 'Kiltseva Doroga, 1, First Floor',
      workingHours: 'Daily 10:00 - 22:00',
      mapLink: 'Link to map',
      city: 'Kiyv'
    },
    {
      name: 'TRC Retroville',
      address: 'Prospekt Pravdy, 47, First Floor, Near Colin\'s',
      workingHours: 'Daily 10:00 - 22:00',
      mapLink: 'Link to map',
      city: 'Kiyv'
    },
    {
      name: 'TRC Blockbuster Mall',
      address: 'Prospekt Stepana Bandery, 36, First Floor',
      workingHours: 'Daily 10:00 - 22:00',
      mapLink: 'Link to map',
      city: 'Kiyv'
    },
    {
      name: 'TRK Prospekt',
      address: 'Gnata Khotkevycha, 1-B, First Floor, Left from Ashan Entrance',
      workingHours: 'Daily 10:00 - 22:00',
      mapLink: 'Link to map',
      city: 'Kiyv'
    },
    {
      name: 'TRC Megamall',
      address: '600-Richchia, 17, New Building, First Floor, Central Alley',
      workingHours: 'Daily 10:00 - 21:00',
      mapLink: 'Link to map',
      city: 'Vinnytsia',
    },
    {
      name: 'TRC Sky Park',
      address: 'Mykoly Ovodova, 51, First Floor, Entrance from Soborna Street, Near Toy House',
      workingHours: 'Daily 10:00 - 21:00',
      mapLink: 'Link to map',
      city: 'Vinnytsia',
    },
    {
      name: 'TRC MOST City',
      address: 'Queen Elizabeth II (Hlinka), 2, Ground Floor',
      workingHours: 'Daily 10:00 - 21:00',
      mapLink: 'Show on Map',
      city: 'Dnipro',
    },
    {
      name: 'TRC Karavan',
      address: 'Nyzhnedniprovskaya, 17, First Floor, Near the Fountain',
      workingHours: 'Daily 10:00 - 21:00',
      mapLink: 'Show on Map',
      city: 'Dnipro',
    },
    {
      name: 'TRC Global',
      address: 'Kyivska, 77, First Floor, Across from LC Waikiki',
      workingHours: 'Daily 10:00 - 21:00',
      mapLink: 'Show on Map',
      city: 'Zhytomyr',
    },
    {
      name: 'Shopping Mall ARSEN',
      address: 'Ivana Mykolaychuka, 2, Across from Samsung',
      workingHours: 'Daily 10:00 - 21:00',
      mapLink: 'Show on Map',
      city: 'Ivano-Frankivsk',
    },
    {
      name: 'Juvent Shopping Center (Boutique 110)',
      address: '4 Varshavska Street',
      workingHours: 'Tue-Sun 10:00 - 18:00',
      mapLink: 'Show on Map',
      city: 'Kovel',
    },
    {
      name: 'PortCity Shopping Mall',
      address: '1 Sukhomlynskoho Street, Second Floor, Near Escalator',
      workingHours: 'Daily 10:00 - 22:00',
      mapLink: 'Show on Map',
      city: 'Lutsk',
    },
    {
      name: 'TSUM Lutsk',
      address: '1 Voli Avenue, Fourth Floor, Near Escalator',
      workingHours: 'Daily 09:30 - 21:00',
      mapLink: 'Show on Map',
      city: 'Lutsk',
    },
    {
      name: 'ESTRO Store (Voli, 9)',
      address: '9 Voli Avenue, Building Facade, Across from Kavarnia Dim Kavy',
      workingHours: 'Daily 09:00 - 21:00',
      mapLink: 'Show on Map',
      city: 'Lutsk',
    },
    {
      name: 'Juvent Shopping Center (Boutique 125)',
      address: '1 Karpenka-Karyho Street',
      workingHours: 'Tue-Sun 09:00 - 21:00',
      mapLink: 'Show on Map',
      city: 'Lutsk',
    },
    {
      name: 'Juvent Shopping Center (Boutique 125a)',
      address: '1 Karpenka-Karyho Street',
      workingHours: 'Tue-Sun 09:00 - 21:00',
      mapLink: 'Show on Map',
      city: 'Lutsk',
    },
    {
      name: 'Forum Lviv Shopping Mall',
      address: '7b Pid Dubom Street, Second Floor, Near Kredens Café',
      workingHours: 'Daily 10:00 - 21:00',
      mapLink: 'Show on Map',
      city: 'Lviv',
    },
    {
      name: 'Victoria Gardens Shopping Mall',
      address: '226-A Kulparkivska Street, First Floor, Near Kredens Café',
      workingHours: 'Daily 10:00 - 20:00',
      mapLink: 'Show on Map',
      city: 'Lviv',
    },
    {
      name: 'King Cross Leopolis Shopping Mall',
      address: '30 Stryiska Street, First Floor, Near Elevator',
      workingHours: 'Daily 10:00 - 21:00',
      mapLink: 'Show on Map',
      city: 'Lviv',
    },
    {
      name: 'ESTRO Store (Doroshenka, 14)',
      address: '14 Doroshenka Street, Building Facade, Near Tram Stops #1 and #2',
      workingHours: 'Daily 10:00 - 20:00',
      mapLink: 'Show on Map',
      city: 'Lviv',
    },
    {
      name: 'City Center Shopping Mall',
      address: '2 Prospekt Nezalezhnosti (Heavenly Hundred Avenue), First Floor, Near Sundays Coffee',
      workingHours: 'Daily 10:00 - 21:00',
      mapLink: 'Show on Map',
      city: 'Odesa',
    },
    {
      name: 'Equator Shopping Mall',
      address: '23 Kulyka i Hudacheka (Makarova), Left Wing of the Shopping Center, Near Athletics',
      workingHours: 'Daily 10:00 - 22:00',
      mapLink: 'Show on Map',
      city: 'Rivne',
    },
    {
      name: 'Zlata Plaza Shopping Mall',
      address: '1 Oleksandra Borysenka (Korolenka), First Floor, Near Allo Max',
      workingHours: 'Daily 10:00 - 21:00',
      mapLink: 'Show on Map',
      city: 'Rivne',
    },
    {
      name: 'Dafi Shopping Mall',
      address: '9 Heroiv Pratsi, First Floor',
      workingHours: 'Daily 10:00 - 20:00',
      mapLink: 'Show on Map',
      city: 'Kharkiv',

    },
    {
      name: 'Nikolsky Shopping Mall',
      address: '2a Pushkinska, Third Floor, Near the Escalator',
      workingHours: 'Daily 10:00 - 21:00',
      mapLink: 'Show on Map',
      city: 'Kharkiv',
    },
    {
      name: "DEPO't Center Shopping Mall",
      address: "265A Haharina, First Floor, Near Vovk",
      workingHours: "Daily 10:00 - 20:00",
      mapLink: "Show on Map",
      city: 'Chernivtsi',
    },

  ];

  const cities = [...new Set(storeData.map(store => store.city))];
  const [selectedCity, setSelectedCity] = useState('Kiyv');

  const filteredStores = selectedCity
    ? storeData.filter(store => store.city === selectedCity)
    : storeData;



  return (
    <>
      <div className="bg-gray-100" style={{ minHeight: '900px' }}>
        <div className="text-gray-700 mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4 text-center">Estro Store</h2>
          {/* Sidebar для кнопок */}
          <div className=" p-4 bg-transparent cursor-pointer">

            {cities.map(city => (
              <a
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`text-gray-700 mr-2 py-1 px-2 w-full rounded-md focus:outline-none hover:text-indigo-500 ${selectedCity === city ? 'bg-indigo-500 text-white hover:text-white' : 'bg-transparent'
                  }`}
              >
                {city}
              </a>
            ))}
          </div>

          {/* Контент з магазинами */}
          <div className=" p-4" >
            <h2 className="text-2xl font-bold mb-4 mx-auto">{selectedCity}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 text-gray-700 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6 ">
              {filteredStores.map((store, index) => (
                <div key={index} className="bg-white p-6 hover:bg-indigo-400 hover:text-white">
                  <h3 className="text-xl font-semibold mb-2">{store.name}</h3>
                  <p className="text-sm mb-2">{store.address}</p>
                  <p className="text-sm mb-2">{store.workingHours}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoreLocations;