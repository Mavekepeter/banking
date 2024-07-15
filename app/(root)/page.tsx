import HeaderBox from '@/components/HeaderBox'
import RightsideBar from '@/components/RightsideBar';
import TotalBalanceBox from '@/components/ui/TotalBalanceBox';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react'

const Home =async () => {
  const loggedIn= await getLoggedInUser();
  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
          type='greeting' 
          title='welcome'
          user={loggedIn?.name ||'Guest'}
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