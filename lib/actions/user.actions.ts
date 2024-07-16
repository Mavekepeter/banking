'use server'

import { Client, ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, parseStringify } from "../utils";
import { User } from "lucide-react";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { plaidClient } from "@/lib/plaid"
import { revalidatePath } from "next/cache";

 
export const signIn = async ({email,password}:signInProps) =>{
    try {
      const { account } = await createAdminClient();
      const response=await account.createEmailPasswordSession(email,password);
      return parseStringify(response);

    } catch (error) {
        console.error('Error', error);
        
    }
}
export const signUp = async (userData:SignUpParams) =>{
  const{email,password,firstName,lastName}=userData;
    try {
        const { account } = await createAdminClient();

       const newUserAccount= await account.create(ID.unique(),
        email, 
        password, 
        `${firstName} ${lastName}`);
        const session = await account.createEmailPasswordSession(email, password);
      
        cookies().set("my-custom-session", session.secret, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        });
        return parseStringify(newUserAccount);
      
    } catch (error) {
        console.error('Error', error);
        
    }
}
// ... your initilization functions

export async function getLoggedInUser() {
    try {
      const { account } = await createSessionClient();
      const user = await account.get();
      return parseStringify(user);
    } catch (error) {
      return null;
    }
  }
export const logoutAccount=async () =>{
  try {
    const { account } = await createSessionClient();
    cookies().delete('my-custom-session');
    await account.deleteSession('current');
    
  } catch (error) {
    return null;
    
  }
}
export const createLinkToken=async(user:User)=>{
  try {
    const tokenparams ={
      user:{
        Client_user_id: user.$id
      },
      Client_name: user.name,
      products:['auth'] as Products[],
      language:'en',
      CountryCode:['US'] as CountryCode[],

    }
    const response=await plaidClient.linkTokenCreate(tokenparams);
    return parseStringify({linkToken:response.data.link_token})
    
  } catch (error) {
    console.log(error)
    
  }
}
export const exchangePublicToken=async({
  publicToken,
  user,
}:exchangePublicTokenProps)=>{
  try {
    const response=await plaidClient.itemPublicTokenExchange({
      public_token:publicToken,
    }); 

    const accessToken=response.data.access_token;
    const itemId=response.data.item_id;
    //get account information using plaid
    const accountsResponse= await plaidClient.accountsGet({
        access_token:accessToken
    });
    const accountData=accountsResponse.data.accounts[0];
    //create account prrocessor for dwolla using the access token and acoint ID
    const request:ProcessorTokenCreateRequest={
      access_token:accessToken,
      account_id:accountData.account_id,
      processor:'dwolla'as ProcessorTokenCreateRequestProcessorEnum,

    };
    const ProcessorTokenResponse=await plaidClient.processorTokenCreate(request);
    const processorToken=ProcessorTokenResponse.data.processor_token;
    //create a funding source url for the account using dwolla customer ID,processor token  and bank name
     const fundingSourceUrl=await addFundingSource({
      dwollaCustomerId:user.dwollaCustomerId,
      processorToken,
      bankName:accountData.name,
     });
     if (!fundingSourceUrl) throw Error;
     // create bank account using the user Id ,item Id accountId,accessToken,Fundind resource url,and sharebleID
     await createBankaccont({
      userId:user.$id,
      bankId:itemId,
      accountId:accountData.account_id,
      accessToken,
      fundingSourceUrl,
      sharableId:encryptId(accountData.account_id),

     });
     //revalidate the path to reflect changes
     revalidatePath('/');
     //return a success message 
     return parseStringify({
      publicTokenExchange:'complete',
     });
  } catch (error) {
    console.error('An error occurred while creating exchange token',error);
    
  }
}