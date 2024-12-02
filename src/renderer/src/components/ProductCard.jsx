import AspectRatio from '@mui/joy/AspectRatio'
import Button from '@mui/joy/Button'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import CardOverflow from '@mui/joy/CardOverflow'
import Chip from '@mui/joy/Chip'
import Typography from '@mui/joy/Typography'

export default function ProductCard({ onButtonClick }) {
  return (
    <Card sx={{ width: 0.25, maxWidth: '100%', boxShadow: 'lg', margin: 1 }}>
      <CardOverflow>
        <AspectRatio ratio={1 / 1} sx={{ minWidth: 200 }}>
          <img
            src="https://s7d1.scene7.com/is/image/mcdonaldsstage/DC_202307_8936_EVM_M_BigMac_Coke_1564x1564?wid=1564&hei=1564&dpr=off"
            alt=""
          />
        </AspectRatio>
      </CardOverflow>
      <CardContent>
        <Typography level="body-lg">Big Mac Combo Meal</Typography>

        <Typography
          level="title-lg"
          sx={{ mt: 1, fontWeight: 'xl' }}
          endDecorator={
            <Chip component="span" size="sm" variant="soft" color="success">
              Special offer
            </Chip>
          }
        >
          32 SAR
        </Typography>
        <Typography level="body-sm">(Ends By 29/11)</Typography>
      </CardContent>
      <CardOverflow>
        <Button onClick={onButtonClick} variant="solid" color="danger" size="lg">
          Add to cart
        </Button>
      </CardOverflow>
    </Card>
  )
}
