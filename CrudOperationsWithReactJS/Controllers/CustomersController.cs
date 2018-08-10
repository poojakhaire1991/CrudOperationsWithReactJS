using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CrudOperationsWithReactJS.Models;

namespace CrudOperationsWithReactJS.Controllers
{
    public class CustomersController : Controller
    {
        MarsOnboardingEntities1 db = new MarsOnboardingEntities1();
        // GET: Customers
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetCustomerData()
        {
            var Customer = db.Customers1.Select(x => new {
                CustomerId=x.CustomerId,
                FirstName=x.FirstName,
                LastName=x.LastName,
                Address=x.Address
            }).ToList();
            return Json(Customer, JsonRequestBehavior.AllowGet);
        }
        public int CreateCustomer(Customer1 cust)
        {
            using (db)
            {
                long id = db.Customers1.Max(x => x.CustomerId);
                cust.CustomerId = id + 1;
                db.Customers1.Add(cust);
                db.SaveChanges();
                return 1;
            }
        }
        public int UpdateCustomer(Customer1 cust)
        {
            using (db)
            {
                db.Entry(cust).State = System.Data.Entity.EntityState.Modified;
                db.SaveChanges();
                return 1;
            }
        }
        public int DeleteCustomer(int id)
        {
            using (db)
            {
                var sp = from r in db.SoldProducts where (r.CustomerId == id) select r;
                foreach(var soldP in sp)
                {
                    db.SoldProducts.Remove(soldP);
                }
                db.SaveChanges();
                Customer1 cust = db.Customers1.Find(id);
                db.Customers1.Attach(cust);
                db.Customers1.Remove(cust);
                db.SaveChanges();
                return 1;
            }
        }
    }
}