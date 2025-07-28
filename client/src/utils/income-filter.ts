import type { Income } from "@shared/schema";

export function filterIncomesByMonth(incomes: Income[], targetMonth: string): Income[] {
  return incomes.filter(income => {
    const incomeDate = new Date(income.date);
    const targetDate = new Date(targetMonth + "-01");
    
    switch (income.frequency) {
      case "one-time":
        // One-time incomes only appear in the month they were recorded
        return income.date.startsWith(targetMonth);
        
      case "monthly":
        // Monthly incomes appear from their start date onwards
        return incomeDate <= targetDate;
        
      case "yearly":
        // Yearly incomes appear once per year in the same month they were created
        const incomeMonth = incomeDate.getMonth();
        const targetMonthNum = targetDate.getMonth();
        const targetYear = targetDate.getFullYear();
        const incomeYear = incomeDate.getFullYear();
        
        return incomeMonth === targetMonthNum && targetYear >= incomeYear;
        
      case "weekly":
        // Weekly incomes appear from their start date onwards (4 times per month)
        return incomeDate <= targetDate;
        
      default:
        return false;
    }
  });
}

export function calculateMonthlyIncomeAmount(income: Income): number {
  const amount = parseFloat(income.amount);
  
  switch (income.frequency) {
    case "monthly":
    case "one-time":
      return amount;
      
    case "weekly":
      // 4 weeks per month
      return amount * 4;
      
    case "yearly":
      // Divide by 12 months
      return amount / 12;
      
    default:
      return amount;
  }
}