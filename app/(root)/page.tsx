import HeaderBox from '@/components/HeaderBox'
import RightsideBar from '@/components/RightsideBar';
import TotalBalanceBox from '@/components/ui/TotalBalanceBox';
import React from 'react'

const Home = () => {
  const loggedIn= {firstName: 'Samuel',lastName:'peter',email:'sam@gmail.com' };
  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
          type='greeting' 
          title='welcome'
          user={loggedIn?.firstName ||'Guest'}
          subtext='access and manage your account and transactions effectively '
          />
          <TotalBalanceBox
          accounts={[]}
          totalBanks={1}
          totalCurrentBalance={1250.35}
          />
          

        </header>

        RECENT TRANSACTIONS
      </div>
      <RightsideBar
      user={loggedIn}
      transaction={[]}
      banks={[{currentBalance:12033.50},{currentBalance:50000.50}]}/>

    </section>
  )
}

export default Home