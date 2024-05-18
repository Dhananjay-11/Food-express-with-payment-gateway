import React, { useEffect, useRef, useState } from 'react'
import HomeCard from '../component/HomeCard'
import { useSelector } from "react-redux";
import CardFeature from '../component/CardFeature';
import { GrPrevious, GrNext } from "react-icons/gr";
import FilterProduct from '../component/FilterProduct';
import AllProduct from '../component/AllProduct';


const Home = () => {
  const productData = useSelector((state)=>state.product.productList)
  console.log(productData);
  const homeProductCartList = productData.slice(0,6)
  const homeProductCartListVegetables = productData.filter(el => el.category === "vegetable",[])
  // console.log(homeProductCartListVegetables);
  const loadingArray = new Array(6).fill(null);
  const loadingArrayFeature = new Array(5).fill(null);
  const slideProductRef = useRef();
  const nextProduct = ()=>{
    slideProductRef.current.scrollLeft += 200
  }
  const preveProduct = ()=>{
    slideProductRef.current.scrollLeft -= 200
  }
  


  return (
    <div className='p-2 md:p-4'>
      <div className='md:flex gap-4 py-2'>
          <div className='md:w-1/2'>
            <div className='flex gap-3 bg-slate-300 w-36 px-2 items-center rounded-full'>
                <p className='text-sm font-medium text-slate-900'>Bike Delivery</p>
                <img alt='' 
                src= "https://cdn-icons-png.flaticon.com/512/2972/2972185.png"
                className='h-7'/>
            </div>
            <h2 className='text-4xl md:text-7xl font-bold py-3'>The Fastest Delivery in <span className='text-red-600 '>Your Home</span></h2>
            <p className='py-3 text-base'>This website is an online platform that facilitates the ordering and delivery of food 
            from various restaurants to customers' locations. The website serves as a digital marketplace, connecting users with
             a wide range of culinary options and providing a convenient way to enjoy meals from the comfort of their homes or workplaces</p>
             <button className="font-bold bg-red-500 text-slate-200 px-4 py-2 rounded-md">
            Order Now
          </button>
          </div>
          <div className='md:w-1/2 flex flex-wrap gap-5 p-4 justify-center'>
            {
              homeProductCartList[0] ?
              homeProductCartList.map(el =>{
                return (
                  <HomeCard
                  key={el._id}
                  id={el._id}
                  image={el.image}
                  name={el.name}
                  price={el.price}
                  category={el.category}
                  />
                )
              })
              :
              loadingArray.map((el,index) =>{
                return(
                  <HomeCard
                  key = {index}
                  loading={"Loading..."}
                  /> 
                )
              })
            }
          </div>
      </div>
      <div className=''>
            <div className='flex w-full items-center'>
            <h2 className="font-bold text-2xl text-slate-800 mb-4 ">Fresh Vegetables</h2>
            <div className='ml-auto flex gap-4'>
              <button onClick={preveProduct} className='bg-slate-300 hover:bg-slate-400 text-lg p-1 rounded'><GrPrevious/></button>
              <button onClick={nextProduct} className='bg-slate-300 hover:bg-slate-400 text-lg p-1 rounded'> <GrNext/> </button>
            </div>
            </div>
            <div className='flex gap-5 overflow-scroll scrollbar-none scroll-smooth transition-all' ref={slideProductRef}>
               {
                 homeProductCartListVegetables[0] ? homeProductCartListVegetables.map(el =>{
                  return (
                    <CardFeature
                    key={el._id+"vegetable"}
                    id={el._id}
                    name={el.name}
                    category={el.category}
                    price={el.price}
                    image={el.image}
                    />
                  )
                })
                :
                  loadingArrayFeature.map((el,index) => <CardFeature
                  loading="Loading..." key = {index}
                  />)
               }
              
            </div>
          </div>
          <AllProduct heading={"Your Products"}/>
    </div>
  )
}

export default Home
