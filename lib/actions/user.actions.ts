'use server'

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";

// import { Client, ID } from "node-appwrite";
// import { createAdminClient, createSessionClient } from "../appwrite";
// import { cookies } from "next/headers";
// import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";

// import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products, LinkTokenCreateRequest } from "plaid";
// import { plaidClient } from "@/lib/plaid";
// import { revalidatePath } from "next/cache";
// import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

// const {
//   APPWRITE_DATABASE_ID: DATABASE_ID,
//   APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
//   APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID
// } = process.env;

// export const signIn = async ({ email, password }: signInProps) => {
//   try {
//     const { account } = await createAdminClient();
//     const response = await account.createEmailPasswordSession(email, password);
//     return parseStringify(response);
//   } catch (error) {
//     console.error('Error', error);
//   }
// }

// export const signUp = async ({ password, ...userData }: SignUpParams) => {
//   const { email, firstName, lastName } = userData;
//   let newUserAccount;
//   try {
//     const { account, datebase } = await createAdminClient();

//     newUserAccount = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);
//     if (!newUserAccount) throw new Error("Error creating user");
//     const dwollaCustomerurl = await createDwollaCustomer({ ...userData, type: "personal" });
//     if (!dwollaCustomerurl) throw new Error('Error creating Dwolla customer');

//     const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerurl);
//     const newUser = await datebase.createDocument(
//       DATABASE_ID!,
//       USER_COLLECTION_ID!,
//       ID.unique(),
//       {
//         ...userData,
//         userId: newUserAccount.$id,
//         dwollaCustomerId,
//         dwollaCustomerurl
//       }
//     );

//     const session = await account.createEmailPasswordSession(email, password);
//     cookies().set("my-custom-session", session.secret, {
//       path: "/",
//       httpOnly: true,
//       sameSite: "strict",
//       secure: true,
//     });
//     return parseStringify(newUser);
//   } catch (error) {
//     console.error('Error', error);
//   }
// }

// export async function getLoggedInUser() {
//   try {
//     const { account } = await createSessionClient();
//     const user = await account.get();
//     return parseStringify(user);
//   } catch (error) {
//     return null;
//   }
// }


// export const logoutAccount = async () => {
//   try {
//     const { account } = await createSessionClient();
//     cookies().delete('my-custom-session');
//     await account.deleteSession('current');
//   } catch (error) {
//     return null;
//   }
// }

// export const createLinkToken = async (user: User) => {
//   try {
//     const tokenparams: LinkTokenCreateRequest = {
//       user: {
//         client_user_id: user.$id
//       },
//       client_name: `${user.firstName} ${user.lastName}`, 
//       products: ['auth'] as Products[],
//       language: 'en',
//       country_codes: ['US'] as CountryCode[],
//     };

//     const response = await plaidClient.linkTokenCreate(tokenparams);
//     return parseStringify({ linkToken: response.data.link_token });
//   } catch (error) {
//     console.error('Error occurred while creating link token:', error);
//   }
// };

// export const createBankAccount = async ({
//   userId,
//   bankId,
//   accountId,
//   accessToken,
//   fundingSourceUrl,
//   sharableId,
// }: createBankAccountProps) => {
//   try {
//     const { datebase } = await createAdminClient();
//     const bankAccount = await datebase.createDocument(
//       DATABASE_ID!,
//       BANK_COLLECTION_ID!,
//       ID.unique(),
//       {
//         userId,
//         bankId,
//         accountId,
//         accessToken,
//         fundingSourceUrl,
//         sharableId,
//       }
//     );
//     return parseStringify(bankAccount);
//   } catch (error) {
//     console.error('Error', error);
//   }
// }

// export const exchangePublicToken = async ({
//   publicToken,
//   user,
// }: exchangePublicTokenProps) => {
//   try {
//     const response = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });
//     const accessToken = response.data.access_token;
//     const itemId = response.data.item_id;

//     const accountsResponse = await plaidClient.accountsGet({ access_token: accessToken });
//     const accountData = accountsResponse.data.accounts[0];

//     const request: ProcessorTokenCreateRequest = {
//       access_token: accessToken,
//       account_id: accountData.account_id,
//       processor: 'dwolla' as ProcessorTokenCreateRequestProcessorEnum,
//     };

//     const ProcessorTokenResponse = await plaidClient.processorTokenCreate(request);
//     const processorToken = ProcessorTokenResponse.data.processor_token;

//     const fundingSourceUrl = await addFundingSource({
//       dwollaCustomerId: user.dwollaCustomerId,
//       processorToken,
//       bankName: accountData.name,
//     });
//     if (!fundingSourceUrl) throw Error;

//     await createBankAccount({
//       userId: user.$id,
//       bankId: itemId,
//       accountId: accountData.account_id,
//       accessToken,
//       fundingSourceUrl,
//       sharableId: encryptId(accountData.account_id),
//     });

//     revalidatePath('/');
//     return parseStringify({ publicTokenExchange: 'complete' });
//   } catch (error) {
//     console.error('An error occurred while creating exchange token', error);
//   }
// }
export const signIn=async( { email, password}:signInProps)=>{
  try {
    const { account } = await createAdminClient();
    const response=await account.createEmailPasswordSession(email, password);
    return parseStringify(response);
    
  } catch (error) {
    console.error('Error',error);

    
  }
}

export const signUp=async(userData:SignUpParams)=>{
  const {email,password,firstName,lastName}=userData;
  try {
    const { account } = await createAdminClient();

  const newUserAccount=await account.create(
    ID.unique(), 
    email, 
    password, 
    `${firstName}${lastName}`);
  const session = await account.createEmailPasswordSession(email, password);

  cookies().set("my-custom-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
  return parseStringify(newUserAccount);
    
  } catch (error) {
    console.error('Error',error);

    
  }
}
// ... your initilization functions

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();

    const user=await account.get();

    return parseStringify(user);
  
  } catch (error) {
    return null;
  }
}
function createEmailPasswordSession(email: any, password: any) {
  throw new Error("Function not implemented.");
}
export const logoutAccount=async () => {
  try {
    const { account }=await createSessionClient();
     cookies().delete('my-custom-session');
     await account.deleteSession('current')
    
  } catch (error) {
    return null;
    
  }
}

