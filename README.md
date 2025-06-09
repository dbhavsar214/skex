# SKEX Stock Trading Application
**Course**: CSCI 5409 Cloud Computing  
**Author**: Divy Bhavsar (B00978267)  
**Term**: Summer 2024  

---

## Project Overview
**SKEX** is a full-stack stock trading platform built with modern cloud technologies. It provides real-time stock data, user authentication, trading operations, and portfolio management.

**Key Components**:
- **Frontend**: Next.js (dynamic UI)
- **Backend**: Node.js 18 (RESTful APIs)
- **Database**: AWS RDS with MariaDB
- **Data Source**: [Polygon.io](https://polygon.io) (50 stocks initially)
- **Live Pricing Limitation**: Due to API constraints (to be addressed in future versions)

---

## Features
### 1. Stock Data
- Unauthenticated users can view stock data
- Authenticated users can **buy/sell** stocks

### 2. Authentication
- **Sign Up**: Email, SIN, and password
- **Login**: Email and password

### 3. Trading Operations
- **Buy/Sell Buttons**: Embedded in stock table rows
- **Validation**:
  - Buy: Redirects to login if unauthenticated
  - Sell: Rejected if stock not in portfolio

### 4. Portfolio
- Accessible only to logged-in users
- Displays purchased stocks

---

## AWS Architecture
![AWS Architecture Diagram](https://via.placeholder.com/600x400?text=VPC+%7C+EC2+%7C+RDS+%7C+Lambda+%7C+SNS+%7C+Backup)  
*Simplified diagram showing AWS services integration*

### Services Used
| Service         | Purpose                                                                 | Key Configuration                          |
|-----------------|-------------------------------------------------------------------------|-------------------------------------------|
| **VPC**         | Secure, isolated network (CIDR: `10.0.0.0/16`)                         | 3 public + 3 private subnets              |
| **EC2**         | Hosts backend (Node.js)                                                | `t2.micro` instance + Security Groups     |
| **Lambda**      | Serverless functions (`buy-stock-test`, `sell-stock-test`)             | Integrated with API Gateway               |
| **RDS (MariaDB)**| Database for user/stock data                                          | `db.r5.large` in private subnets          |
| **SNS**         | Email notifications                                                    | Topic: `skex-sns`                         |
| **AWS Backup**  | Automated daily backups                                                | Vault: `skex-backup-vault`                |

### Deployment Model
- **Hybrid Cloud**: Public/private subnets in VPC
- **Multi-Tier Architecture**:
  1. **Network Layer**: VPC/subnets
  2. **Compute Layer**: EC2 + Lambda
  3. **Database Layer**: RDS
  4. **Auxiliary Layer**: SNS + Backup

---

## Delivery Model
**Infrastructure as Code (IaC)** via AWS CloudFormation + **Docker**:
1. **Docker Containers**:
   - Images stored on Docker Hub
   - Deployed to EC2 instances
2. **CloudFormation Workflow**:
   - Templates define VPC, EC2, RDS, Lambda, etc.
   - Ensures reproducible deployments

---

## Security
- **Data in Transit**: HTTPS/TLS encryption
- **Data at Rest**: RDS encryption + AWS Backup
- **Network**: VPC isolation + Security Groups
- **IAM**: Least-privilege roles + MFA for admin
- **Application**: Password hashing + session validation

---

## Cost Analysis
**Estimated Monthly Cost**: $219.71  

| Service         | Cost Breakdown                          |
|-----------------|-----------------------------------------|
| EC2 (t2.micro)  | $8.35 (compute) + $3.00 (EBS)           |
| RDS (db.r5.large)| $203.76 (compute) + $2.30 (storage)    |
| SNS             | $0.40 (1K emails)                       |
| AWS Backup      | $1.90 (20 GB storage)                   |
| Lambda          | $0 (within free tier)                   |

**Cost-Saving Alternatives**:
- Use EC2 Reserved Instances (save ~75%)
- Downgrade RDS to `db.t3.medium` if feasible
- Optimize Lambda memory/duration

---

## Setup & Deployment
### Prerequisites
- AWS CLI configured
- Docker installed
- CloudFormation templates & Docker images

### Deployment Steps
1. **Deploy Infrastructure**:
```bash
aws cloudformation deploy --template-file template.yml --stack-name skex-stack
